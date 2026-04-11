---
title: "AI Coding Agents Got Smarter, My Codebase Got Worse 🤗"
date: 2026-04-11
description: "I spent an afternoon letting AI agents fix minor inconveniences in a codebase I know inside and out. They overcomplicated everything — and I have thoughts."
draft: false
---

We are being lied to. Touting AI agents as a new operating system is ambitious at best.

I have been using a custom documentation framework for close to a year now. I am intimately familiar with this small, focused codebase and how it works.

It has needed minor changes for a while, and I've simply worked around those inconveniences. Today I spent the afternoon fixing the root causes of those minor inconveniences inside the codebase — using Claude Code, obviously.

All hell broke loose. AI agents added unnecessary programming languages, subfolders, and folders I do not want or need. They generally made a super simple codebase overly complicated. The codebase is simple by design.

"Zach, it's your fault. You didn't give the agents enough direction."

Maybe. However, I have been using this codebase for over nine months, using the exact same language that previously worked.

---

Why would it overcomplicate the codebase? Some of the additional files were internal tooling — for me, the developer of the codebase.

I reject that addition because the codebase is purely templates to be imported by other projects. Internal tooling is the responsibility of whoever is using this documentation framework in their product.

Although I import this documentation into different projects very regularly, this codebase does not know how — or even that — it's being used in other projects. The agent kept asking me questions that seemed so obvious to me.

The agent working on the documentation codebase did not know that this repo exists to be used as a template for other projects.

Anyway, I updated my personal documentation framework.

[agentland-docs on GitHub](https://github.com/taketaketaketake/agentland-docs)

Only use it if you like having strict documentation accountability and using spec-driven development patterns in your agentic workflow.
