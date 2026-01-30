---
title: "⭐ I Got My First Star on a Public GitHub Repo"
date: 2026-01-30
description: "I recently extracted the documentation framework I use across all my projects and put it on npm. Here's what makes it different."
draft: false
---

I recently extracted the documentation framework I use across all my projects and put it on npm.

One command scaffolds a complete documentation framework with an interactive walkthrough that customizes everything to your project.

But this isn't a template you'll outgrow in a week.

Every file has a contract. A central glossary defines what each doc is responsible for, what triggers an update, and what does NOT belong inside it. When your architecture changes, the glossary tells you exactly which files need updating. No guessing. No drift.

The core files:

→ **vision.md** — what your system is and isn't  
→ **architecture.md** — layers, boundaries, data flow  
→ **invariants.md** — rules that must never break, no matter what  
→ **implementation-plan.md** — phased execution with built-in audit gates  
→ **markdown-glossary.md** — the hub that governs everything above

There's also a phase audit system. Before any phase can be marked complete, an audit checks that every triggered doc was actually updated. Documentation stays in sync with reality because the framework enforces it.

Works for new projects or existing codebases. Drop it in, fill in the blanks, and your project has a spine.

Free and open source.

**npm:** `npx spec-driven-docs init`  
**GitHub:** [https://github.com/taketaketaketake/agentland-docs](https://github.com/taketaketaketake/agentland-docs)
