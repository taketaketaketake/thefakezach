---
title: "NLSR: What If AI Could Revise While It Writes?"
date: 2026-04-12
description: "Introducing the Non-Linear Stream Renderer — an open source rendering engine where multiple AI agents write forward and revise earlier text simultaneously, in real time."
draft: false
---

We're used to watching AI think in one direction.

A token appears. Then another. Then another. The cursor blinks at the end of the line, creeping forward like a typewriter that only knows how to go right.

It's not how good writers work.

A good writer writes a sentence, reads it back, crosses out a word, tries a better one — all while the next paragraph is already forming in their head. Writing is non-linear. Revision is constant. Forward motion and backward correction are simultaneous.

The Non-Linear Stream Renderer (NLSR) is an open source rendering engine and coordination layer that brings this model to multi-agent LLM output. Multiple agents write forward and revise earlier text at the same time, on a shared character grid, in real time.

## The Problem with One-Dimensional Streaming

Today's LLM streaming UIs all work the same way: tokens append to the end of a text buffer, and the UI renders them as they arrive. It's fast, it's simple, and it has a ceiling.

When a model streams tokens one-by-one, it has committed to the text it already produced. There's no going back. If the opening sentence set the wrong tone, if a fact in paragraph two is inconsistent with paragraph three, if the summary clause could have been sharper — the model can't fix it. It can only keep going.

The standard workarounds are unsatisfying:

- **Post-processing** — run a second LLM call after the first finishes. Slow, and the user sees the bad version first.
- **Chain-of-thought** — make the model plan before writing. Adds latency, requires structured prompting, and still doesn't fix output in flight.
- **Multiple passes** — generate, then review, then rewrite in full. Expensive, slow, and loses the streaming UX entirely.

NLSR takes a different approach: concurrent write and revision.

## How NLSR Works

NLSR operates on a fixed-size character grid — a viewport of, say, 72 columns by 22 rows. Multiple agents share this viewport simultaneously.

A primary agent streams text into the grid, left to right, top to bottom, exactly like a typewriter. Characters appear with a typing animation. The primary agent never stops or pauses.

Revision agents independently scan the text buffer, find phrases worth improving, and jump back to edit them. A revision agent highlights the target phrase in red, erases it character-by-character from right to left, then retypes the replacement in purple — all while the primary agent continues writing new text below.

Both agents operate concurrently. Neither blocks the other. The viewport is the coordination mechanism.

## The Algorithm: Three Phases of Revision

Every revision executes in three phases, animated in real time:

**Phase 1 — Highlight (400ms)** The revision cursor jumps to the phrase. All target cells are highlighted in red. The viewer sees exactly what's about to change.

**Phase 2 — Erase (18ms per character, right to left)** Characters are removed one by one in reverse order. The revision cursor follows the erase position backward — a backspace animation that makes the replacement feel intentional, not jarring.

**Phase 3 — Retype (20ms per character, forward)** The replacement is typed in place. Surrounding text reflows instantly. The new characters are highlighted in purple for 800ms, then fade to match the rest of the text.

## Reflow and Diffing

Every write and every revision runs through the same pipeline:

1. Append to or modify the logical text buffer
2. Run `reflowToGrid` — word-wrap the full buffer into the character grid
3. Run `diffGrids` — compare the current screen state to the new target state
4. Apply the diff: instant changes (reflow shifts) apply immediately; animated changes (new characters, typed replacements) queue for animation

The diff is always computed against the actual screen state (`gridRef`), not the logical old text. This means if a prior write is mid-animation when a new write arrives, the new animation picks up exactly where the screen is — no visual discontinuity.

## Settled Text: When Revision is Safe

Revision agents can only target settled text — text that ends on a complete sentence boundary (period, question mark, or exclamation mark). Mid-sentence text is off-limits.

This rule exists for a specific reason: if a revision agent targets a half-formed sentence, it could conflict with characters the primary agent is still typing. The sentence boundary is the smallest unit of coherent meaning that's safe to revise. The primary agent never pauses; the settled index advances on every write.

The settled text detector handles abbreviations (Mr., Dr., U.S.), decimal numbers (4.2%), and single-letter initials (J. K. Rowling) to avoid false sentence breaks.

## Conflict Resolution: Optimistic Concurrency

When multiple revision agents run in parallel, they can independently decide to revise the same region. NLSR resolves this with a three-rule system:

1. **Positional priority** — the revision targeting earlier text in the buffer goes first
2. **First-to-commit wins** — once a revision commits, any overlapping in-flight revision is rejected
3. **Rejected agents re-evaluate** — the rejected agent receives the updated buffer and can decide if its revision still applies to the new text

This is optimistic concurrency — no locks, no blocking, no agent-to-agent negotiation. The common case (no overlapping revisions) has zero overhead. The conflict case resolves cleanly and gives rejected agents the information they need to retry intelligently.

Committed regions are pruned after 30 seconds, so the same phrase can be revised multiple times across long generation sessions.

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Rendering Layer (src/nlsr/)                    │
│  NLSRRenderer ← write() / revise() API         │
│  grid.js ← reflow, diff, phrase search         │
└──────────────────┬──────────────────────────────┘
                   │ called by
┌──────────────────▼──────────────────────────────┐
│  Coordination Layer                             │
│  - Agent registration (primary / revision)      │
│  - Settled text tracking                        │
│  - Conflict resolution (optimistic concurrency) │
│  - Message board (inter-agent context)          │
└──────┬──────────────────────────┬───────────────┘
       │                          │
┌──────▼──────────┐    ┌──────────▼──────────┐
│  Primary Agent  │    │  Revision Agent(s)  │
│  Streams tokens │    │  Monitors settled   │
│  Never pauses   │    │  text, decides      │
└─────────────────┘    │  revisions          │
                       │  Multiple in        │
                       │  parallel           │
                       └─────────────────────┘
```

The renderer knows nothing about agents or LLMs. It exposes two methods via React ref:

- `ref.current.write(text)`
- `ref.current.revise(oldPhrase, newPhrase, reason)`

Everything above the renderer — agent logic, LLM calls, revision strategy — is your code.

## Use Cases

### 1. Research Summary with Live Fact-Checking
A primary agent streams a research summary while fact-checking agents work in parallel. As the summary grows, a fact-checker spots a claim that conflicts with the source material and revises it in place — before the reader has even finished reading the paragraph above it.

The output the user sees has already been corrected by the time they reach it.

### 2. Live Report Generation
A business intelligence tool generates a quarterly earnings report. A primary agent streams findings paragraph by paragraph. A style editor runs concurrently, catching passive voice and hedging language ("it may be seen that") and replacing them with direct statements ("revenue grew 12%"). The report arrives already polished.

### 3. Multi-Draft Composition
A creative writing tool runs three revision agents in parallel: one for consistency (flags when a character's name changes mid-story), one for pacing (shortens verbose passages), one for word choice (upgrades weak verbs). The primary agent writes. The revision agents improve. The viewer watches the text evolve in real time.

### 4. Streaming Code Generation
A code generation tool streams an implementation. A separate agent watches the settled text for opportunities to add inline comments, improve variable names, or correct algorithmic choices — revising as the primary agent writes the next function.

### 5. Live Translation with Quality Revision
A primary agent streams a translation of source material. A second agent monitors the settled translated text and identifies calques (word-for-word transfers that don't work in the target language), replacing them with idiomatic equivalents — concurrently, without pausing the primary translation stream.

### 6. Accessible Simplification
A primary agent produces a detailed technical explanation. A parallel simplification agent rewrites complex terminology and long sentences for accessibility — turning "myocardial infarction" into "heart attack" and "utilize" into "use" — while the primary continues elaborating.

## Getting Started

Install NLSR from npm:

```bash
npm install nlsr
```

Peer dependencies: `react >= 18`, `react-dom >= 18`

### Quick Start

```jsx
import { useRef, useEffect } from "react";
import { NLSRRenderer, createCoordinator } from "nlsr";

function App() {
  const renderer = useRef(null);
  const coordinator = useRef(null);

  useEffect(() => {
    coordinator.current = createCoordinator(renderer);
    coordinator.current.registerAgent("writer", "primary");
    coordinator.current.registerAgent("editor", "revision");
  }, []);

  return <NLSRRenderer ref={renderer} cols={72} rows={22} />;
}
```

### Wire in Your LLM

NLSR doesn't call any LLM API. You bring your own agents and wire them into the coordinator.

With the Anthropic SDK:

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Primary agent streams into write()
const stream = await client.messages.stream({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a market analysis." }],
});

for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
    coordinator.write("writer", event.delta.text);
  }
}

// Revision agent reads settled text, decides what to improve
const settled = coordinator.getSettledText();
const revision = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 256,
  system: "You are an editor. Given text, output JSON: {old, new, reason}",
  messages: [{ role: "user", content: `Improve this:\n${settled}` }],
});

const { old, new: replacement, reason } = JSON.parse(revision.content[0].text);
coordinator.revise("editor", old, replacement, reason);
```

With the stream adapter (fetch/SSE/async iterable):

```javascript
import { streamAdapter } from "nlsr";

const response = await fetch("/api/generate", { method: "POST", body: prompt });
const { stop } = streamAdapter(coordinator, response.body, {
  agentId: "writer",
  parse: (chunk) => JSON.parse(chunk).choices?.[0]?.delta?.content ?? null,
  onDone: () => console.log("done"),
});
```

### Parallel Revision Agents

```javascript
coordinator.registerAgent("writer", "primary");
coordinator.registerAgent("style-editor", "revision");
coordinator.registerAgent("fact-checker", "revision");

// Primary writes continuously
startPrimaryStream(coordinator);

// Multiple revision agents run in parallel, independently
setInterval(() => {
  const settled = coordinator.getSettledText();
  runStyleCheck(coordinator, "style-editor", settled);
  runFactCheck(coordinator, "fact-checker", settled);
}, 2000);
```

Conflict resolution is built in. If `style-editor` and `fact-checker` both target the same phrase, NLSR resolves it automatically — earlier text wins, the rejected agent gets the updated buffer and can re-evaluate.

### The Message Board

Agents in NLSR don't communicate directly with each other. Instead, they share a message board — a chronological, bidirectional log attached to the text buffer.

```javascript
// Primary agent leaves a note
coordinator.messageBoard.post("writer", "APAC numbers are preliminary — fact-check Q3.");

// Revision agent reads context before deciding
const messages = coordinator.messageBoard.read();
const notes = messages.filter(m => m.agentId === "writer");
```

This gives revision agents additional context — writer intent, flagged uncertainties, style directives — without tight coupling between agent implementations.

### Viewport Presets

The grid dimensions are configurable props:

| Preset | Dimensions | Use Case |
|--------|-----------|----------|
| Micro | 40x6 | Headlines, taglines |
| Small | 60x12 | Emails, social posts |
| Medium | 72x22 | Research summaries, memos (default) |
| Wide | 90x16 | Comparison reports |
| Full page | 80x40 | Long-form reports |

```jsx
<NLSRRenderer ref={renderer} cols={72} rows={22} />
```

## Why This Matters

LLM output quality is often discussed in terms of model capability — bigger model, better output. But the generation process itself has been a black box: tokens stream out, the user waits, the output is what it is.

NLSR challenges that assumption. The quality of streamed output is not fixed at generation time. It can be improved *during* generation, by other agents, concurrently, with no interruption to the user experience.

This is the key insight: revision doesn't have to come after writing. It can happen at the same time.

The implications are significant:

- **Higher quality output at equivalent cost** — revision agents catch errors before the primary agent's text scrolls past the reader
- **No post-processing latency** — corrections appear as part of the original stream, not in a second pass
- **Observable AI editing** — users can see the model change its mind in real time, building trust in the output
- **Separation of concerns** — different agents can specialize: one for facts, one for style, one for consistency — none blocking the others

## Open Source

NLSR is fully open source under the MIT license.

The engine is provider-agnostic by design. It doesn't favor any LLM API, any agent framework, or any application domain. It's a rendering and coordination substrate — the part that's hard to build correctly — that you can wire to any LLM backend.

- **Repository:** [github.com/taketaketaketake/non-linear-stream-renderer](https://github.com/taketaketaketake/non-linear-stream-renderer)
- **npm:** `npm install nlsr`

If you're building anything in the multi-agent LLM space — research tools, writing assistants, code generators, live reporting systems — NLSR gives you the rendering and coordination layer so you can focus on the agents themselves.
