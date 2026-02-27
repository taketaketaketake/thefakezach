---
title: "I Built Air Traffic Control for AI Coding Agents"
date: 2026-02-27
description: "AgentLand Observability is a real-time dashboard that shows you exactly what your AI coding agents are doing — every tool call, every decision, every failure — across all sessions in one place."
draft: false
---

If you're running multiple AI coding agents at once — Claude Code on the backend, Gemini CLI on the frontend — you're basically flying blind. You tab-switch between terminals, scroll through output, and hope nothing goes sideways while you're not looking.

I built AgentLand Observability to fix that. It's a real-time dashboard that captures every meaningful event from your AI agents and streams it to a single view in your browser.

Think of it like air traffic control, but for AI agents working on your code.

## How It Works

The system has four parts: hooks that capture events, a server that stores and broadcasts them, a dashboard that visualizes everything, and an evaluation system that scores agent quality.

### The Hooks (the ears)

Both Claude Code and Gemini CLI have a "hooks" system — they can run small scripts whenever certain things happen. I wrote Python scripts that plug into those hooks. Every time an agent reads a file, runs a command, writes code, starts a session, or ends one, the hook fires off a tiny HTTP POST to the server with the event details.

The scripts are lightweight and fail silently. If the dashboard server isn't running, your agents keep working normally. Zero interruption.

One of the Claude Code hooks also acts as a safety gate: before any tool runs, it checks whether the command is dangerous (like `rm -rf /` or accessing `.env` files) and blocks it if so.

### The Server (the brain)

A lightweight Bun server with SQLite. It accepts incoming events via REST, stores them, and immediately broadcasts each one over WebSocket to all connected dashboards. When a session ends, the hook script reads the full conversation transcript from disk and uploads it for permanent storage — including the AI's internal thinking blocks.

### The Dashboard (the eyes)

A React app with four tabs:

- **Live** — Real-time event feed. Events appear instantly. Each agent gets its own color and swim lane. If an agent asks a human-in-the-loop question, it shows up here and you can respond directly from the dashboard.
- **Insights** — Analytics. KPIs, event type breakdowns, tool success/failure rates, agent activity rankings.
- **Transcripts** — Full conversation history for any completed session. Every user prompt, every assistant response, every thinking block. Searchable.
- **Evals** — Score agent quality with four evaluators (more on this below).

### The Evaluation System (the judge)

This is the most interesting part. Four evaluators, two of which use LLMs as judges:

- **Tool Success** — Pure logic. Counts tool success vs. failure rates across agents and sessions. Zero cost.
- **Transcript Quality** — Uses an LLM judge to score each conversation exchange on user input quality and assistant response quality across five dimensions, 1-5 scale. Uses stratified sampling so it evaluates evenly across sessions.
- **Reasoning Quality** — Also LLM-judged. Evaluates the AI's internal thinking blocks for depth, coherence, and self-correction ability.
- **Regression Detection** — Pure statistics. Compares the last 24 hours against a 7-day baseline using z-score tests. Automatically flags if quality has gotten significantly worse or better. Zero cost.

Evaluations run asynchronously and stream progress back to the dashboard in real time.

## The Event Pipeline

The whole flow takes milliseconds:

1. Claude Code decides to read a file
2. The PreToolUse hook fires
3. The Python script sends an HTTP POST to `localhost:4000/events`
4. The server saves to SQLite and broadcasts over WebSocket
5. The dashboard re-renders — event appears in the live feed, agent status updates, charts refresh

Every event carries a `source_app` and `session_id`. In the dashboard, agents show as something like `claude-code:a3f8b2c1`. When the event includes a working directory, the project name replaces the source app for more useful context. Agents show as "active" if they've sent an event in the last 2 minutes, "idle" after that, and "stopped" once a session-end event arrives.

## The Stack

Everything is deliberately lightweight:

- **Server:** Bun + SQLite (WAL mode for concurrent reads/writes)
- **Client:** React 19 + TypeScript + Vite + Tailwind CSS
- **Hooks:** Python scripts run via uv (inline dependency declarations, no virtualenv needed)
- **Charts:** Hand-rolled SVG components (zero chart library dependencies)
- **Transport:** WebSocket for real-time streaming
- **Testing:** Bun's built-in test runner + Playwright for E2E

No Docker, no cloud services, no external databases. It all runs locally on your machine.

## Why This Matters

AI coding agents are powerful, but they're opaque. You don't know what decisions they're making, how often their tools fail, or whether their reasoning quality is degrading over time. AgentLand Observability makes all of that visible — and measurable.

If you're running AI agents on real codebases, you should be watching what they do.

## Visual Overview

For a visual walkthrough of the dashboard and its features, check out the [AgentLand Observability PDF](/AgentLand_Observability.pdf).
