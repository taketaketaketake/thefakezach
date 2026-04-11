---
title: "I Built a Non-Linear Writing App Because My Brain Doesn't Work in a Straight Line"
date: 2026-04-11
description: "A deep-dive into how and why I built a writing tool that lets you capture thoughts in any order, then connect them into something coherent. Plus a full Remotion walkthrough script."
draft: false
---

Most writing apps assume you start at the beginning and end at the end.

Open document. Write sentence one. Write sentence two. Write paragraph two. Finish. Export.

That is not how I think. That is not how most people I know think. Ideas arrive mid-shower, mid-drive, mid-conversation. The ending of something comes to me before the introduction. The best line of a piece shows up while I'm doing something completely unrelated.

Linear writing tools are built for the editing phase. They are terrible for the capture phase.

So I built something different.

---

## What Non-Linear Writing Actually Means

Non-linear writing means you write in fragments. You don't start at the top and work down. You capture whatever arrives — in whatever order it arrives — and you deal with the structure later.

Every blog post on this site started this way. I'm usually doing something — cleaning an Airbnb, driving, watching my kids at dance class — and a thought hits me. I used to open Notes on my phone, dump it in, and never look at it again. The thought evaporated before it became anything.

The problem wasn't that I wasn't capturing ideas. The problem was I had no system for connecting them.

---

## The Problem With Every Other Tool

**Notes apps** are graveyards. You dump things in and they die there.

**Notion** is a database cosplaying as a writing tool. Great for documentation, terrible for the messy act of actually writing something raw.

**Google Docs** is a word processor. It expects a finished document to exist before you open it.

**Roam / Obsidian** are closer to what I wanted, but they're built for researchers and knowledge management nerds. The friction is too high for someone who just needs to capture a thought in 15 seconds.

I needed something that felt closer to throwing sticky notes on a wall — but with the ability to eventually pull those notes into a coherent piece.

---

## What I Built

The app has three modes: **Capture**, **Connect**, and **Compose**.

### Capture

This is the entry point. It looks like a single text field. No formatting options, no toolbar, nothing else on screen. You type (or speak) a fragment. Hit enter. It saves. That's it.

Fragments can be one sentence. They can be a half-finished thought. They can be a fully formed paragraph. The app doesn't care. It timestamps them, tags them loosely by topic using a lightweight AI pass, and moves on.

The capture experience is deliberately frictionless. The goal is that you never think "I should write this down" and then decide not to because opening the app is too much work.

### Connect

The connect view shows your fragments as cards on a canvas. Think spatial, not list-based.

You can drag cards around. You can draw connections between them — this fragment leads to that one, or these two are related but I don't know how yet. You can group fragments into clusters and give a cluster a working title.

This is where the messy, honest part of writing lives. The canvas is supposed to look chaotic. That's not a bug. That's what thinking looks like.

There's a light AI assist here — you can ask it to find fragments that seem to be about the same thing and surface those pairs. It doesn't reorganize anything without your permission. It just points.

### Compose

When you're ready to turn a cluster of fragments into a real piece, you enter compose mode.

Compose mode is closer to a traditional editor — but it starts with your fragments already in it. Your cards become blocks. You can drag them into order, expand them, edit them, delete what doesn't belong.

The goal is that you spend most of your time in Capture and Connect, and by the time you open Compose, you already know what you want to say. You're just arranging it and cleaning it up.

The hard creative work happened earlier, in scattered moments throughout your actual day.

---

## The Technical Architecture

The app is built on **React** and **TypeScript** for the frontend, with a **Fastify** backend and **PostgreSQL** via **Prisma** for storage.

The canvas in the Connect view uses **React Flow** — it handles the node graph rendering, edges, drag behavior, and zoom. It was the right choice. Building a custom canvas for this would have been a massive time sink for questionable gain.

Fragment auto-tagging runs on a serverless function that calls the **OpenAI API** with a lightweight classification prompt. It returns one to three loose topic tags per fragment. These aren't used to organize content — they're used to surface potential connections in the Connect view.

The speech-to-text input in Capture mode uses the **Web Speech API** where available, with a **Deepgram** fallback for lower-latency transcription on supported devices. I use the speech input more than the keyboard in Capture mode. That part matters.

Authentication is magic link via **Resend**. No passwords. The writing experience should feel calm, not like a product that needs you to constantly log in.

---

## Why This Exists

I've shipped over 20 projects in the last year. Most of them are technical — APIs, platforms, voice agents, marketplaces.

Writing has always run parallel to the building. The blog, the posts, the thoughts I share online — that's how I process what I'm building and why.

But I was losing ideas constantly. Not for lack of effort. Just for lack of a system that matched how I actually think.

This app is that system. It's not for everyone. It's specifically for people whose thinking doesn't arrive in order — which, if you're honest, is most people.

---

## Remotion Walkthrough Script

*The following is the script for a video walkthrough of the app, designed to be paired with a Remotion-produced animation.*

---

**[SCENE 1 — COLD OPEN: 0:00–0:08]**

*Black screen. Single line of text fades in:*

> "Most writing apps assume you start at the beginning."

*Pause. Text fades out.*

> "Mine doesn't."

---

**[SCENE 2 — PROBLEM STATEMENT: 0:08–0:30]**

*Split screen. Left side: a blank Google Doc, cursor blinking. Right side: a phone Notes app filled with dozens of untitled entries.*

Voiceover:

> "You've had the experience. You open a document. You stare at it. The cursor blinks. Nothing comes. Not because you have nothing to say — but because you're asking yourself to start at the beginning when your brain is somewhere in the middle."

*The Notes app fills the right side. Entries scroll by: half-sentences, timestamps from 2am, random location pins from months ago.*

> "Or the opposite — you're capturing everything. Hundreds of notes. None of them connected. None of them going anywhere."

---

**[SCENE 3 — INTRODUCING THE APP: 0:30–0:48]**

*App opens. Clean interface. Single dark background, single input field at center.*

Voiceover:

> "This is Capture. One field. No menus. No formatting. Just: what are you thinking right now?"

*User types: "The reason nobody finishes anything they start isn't motivation — it's that they opened a blank document."*

*Hits enter. Card animates out and files away. Input field resets.*

> "That thought is saved. Tagged. Timestamped. The app runs a lightweight AI pass in the background — not to rewrite it, just to understand what it's about."

---

**[SCENE 4 — CAPTURE IN MOTION: 0:48–1:15]**

*Time-lapse style. Multiple fragments appear across the screen in quick succession — each one a real thought dropped in at different times. Some are long, some are just a phrase. Timestamps span different days.*

Voiceover:

> "You don't sit down to write. You capture throughout your day. Driving. Waiting. Between tasks. The app gets out of your way. That's the whole point."

*Last fragment drops in. Screen transitions.*

---

**[SCENE 5 — CONNECT VIEW: 1:15–1:55]**

*Canvas loads. Cards scattered across the screen. Some clustered, some isolated.*

Voiceover:

> "This is Connect. Your fragments are cards. The canvas is a wall. You're not writing here — you're thinking spatially."

*User drags two cards close together. An edge appears between them. A cluster forms.*

> "You drag related ideas together. You draw connections between fragments that don't obviously belong but feel like they should. Clusters become the rough shape of a piece."

*AI assist button activates — a few card pairs highlight.*

> "The AI assist surfaces fragments that seem related. It doesn't reorganize anything. It just points. You decide what belongs together."

*A cluster gets a working title: "Why nobody finishes things."*

---

**[SCENE 6 — COMPOSE VIEW: 1:55–2:25]**

*Compose mode opens. Fragments from the cluster appear as blocks in a vertical editor.*

Voiceover:

> "Compose mode is the closest this gets to a normal editor. But it starts populated. Your fragments are already here — in whatever rough order made sense on the canvas."

*User rearranges two blocks. Deletes a sentence. Expands a paragraph.*

> "You're not staring at a blank page. You're finishing something that already exists. Most of the real creative work happened in scattered moments across your actual day."

*Block by block, a post takes shape on screen.*

---

**[SCENE 7 — EXPORT & CLOSE: 2:25–2:45]**

*Export button. Markdown output. The finished post.*

Voiceover:

> "When it's done — export to markdown, copy to wherever you publish. The app doesn't try to be your CMS or your publishing platform. That's not its job."

*Screen fades. Single fragment card floats on screen:*

> "The hard part isn't finishing. It's capturing the right things while they're still fresh."

---

**[SCENE 8 — CLOSE: 2:45–3:00]**

*App name appears. Clean. Minimal.*

Voiceover:

> "Non-linear writing. Built for how thinking actually works."

*Fade to black.*

---

## The Honest Summary

This app exists because I was losing too many ideas to bad tooling.

It's built around a simple belief: the messy, non-linear act of capturing and connecting is where real writing happens. The clean draft that exists at the end is just the evidence of that process.

If you've ever had a great idea die because you didn't write it down fast enough — or because you wrote it down and could never find it again — this was built for you.

I use it every day. The blog post you just read came through it.
