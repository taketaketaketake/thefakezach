// Projects (show expertise) and free tools (gain users) for the / site.
// Edit links/status freely — placeholders use "#".

export interface ShowcaseItem {
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  status: string;        // e.g. "Live", "In development", "Open source", "Private build"
  href?: string;         // live site / repo / tool page
  cta?: string;          // link label
  install?: string;      // optional install/usage command for tools
  image?: string;        // optional screenshot/image path (e.g. "/project-shots/agentland.png")
  featured?: boolean;
}

export const projects: ShowcaseItem[] = [
  {
    title: "AgentlandOS",
    tagline: "AI agents that run a business",
    description:
      "A platform that gives non-technical business owners the power of AI agents to operate and grow their business. React 19 + TypeScript frontend talking to 10+ backend microservices through a single gateway. This is the system that runs my own companies.",
    tags: ["AI agents", "React 19", "Microservices", "SaaS"],
    status: "In development",
    href: "#",
    cta: "Learn more",
    image: "/project-shots/agentland-os-cover.png",
    featured: true,
  },
  {
    title: "TraceTrack",
    tagline: "GitHub for AI workflows",
    description:
      "A collaborative platform where developers share, fork, and improve how they work with AI coding tools — backed by real trace evidence. Span-tree viewer, prompt pipelines, trace diffs, pull requests, and eval suites. Capture from Claude Code, Cursor, Gemini, Codex.",
    tags: ["Dev tools", "Observability", "Evals", "Collaboration"],
    status: "Live",
    href: "https://tracetrack.io",
    cta: "Visit tracetrack.io",
    featured: true,
  },
  {
    title: "Trading System",
    tagline: "Agent-based multi-factor signals",
    description:
      "A multi-factor trading system with agent-based signal generation, Polymarket smart-wallet tracking, and a React dashboard. FastAPI + Postgres backend with automated scanners.",
    tags: ["Quant", "FastAPI", "Agents", "Dashboard"],
    status: "Private build",
    href: "#",
    cta: "Ask me about it",
  },
];

export const tools: ShowcaseItem[] = [
  {
    title: "USER.md Generator",
    tagline: "Give any AI assistant context about you",
    description:
      "A fun, no-signup tool to build your own USER.md — a single file that tells any AI assistant who you are, your goals, and how you like to work. Fill out the form, watch it build live, then copy or download.",
    tags: ["AI context", "Free", "No signup"],
    status: "Free tool",
    href: "/tools/user-md",
    cta: "Open the tool",
    featured: true,
  },
  {
    title: "Multi-Agent Observability",
    tagline: "Mission control for your AI coding sessions",
    description:
      "A real-time observability dashboard for Claude Code and Gemini CLI. Captures hook events, streams them over WebSocket, and shows a live feed with agent tracking, transcripts, analytics, and LLM-powered evaluation.",
    tags: ["Open source", "Claude Code", "Observability"],
    status: "Open source",
    href: "/tools/observability",
    cta: "Learn more",
  },
  {
    title: "Spec-Driven Docs",
    tagline: "Keep docs in sync with AI-written code",
    description:
      "A documentation framework that treats docs as enforceable contracts. When code changes, it knows which docs are stale and blocks progress until they're current. Drop it into any project in one command.",
    tags: ["Open source", "DX", "Docs"],
    status: "Open source",
    href: "/tools/spec-driven-docs",
    cta: "Learn more",
    install: "npx spec-driven-docs init",
  },
  {
    title: "NLSR",
    tagline: "Non-Linear Stream Renderer",
    description:
      "A rendering engine for concurrent multi-agent text output on a fixed character grid. Multiple LLM agents write forward and revise earlier text simultaneously, coordinated through a shared grid flushed at 60fps.",
    tags: ["Open source", "npm", "React"],
    status: "Open source",
    href: "/tools/nlsr",
    cta: "Learn more",
    install: "npm install nlsr",
  },
  {
    title: "Video Downloader",
    tagline: "Paste a URL, get the video",
    description:
      "A media service that wraps yt-dlp and ffprobe — download any video by URL in the quality you choose, with metadata, chapter, and frame extraction. Guardrails and concurrency limits built in.",
    tags: ["Open source", "yt-dlp", "FastAPI"],
    status: "Open source",
    href: "/tools/video-downloader",
    cta: "Learn more",
  },
  {
    title: "Media Analysis",
    tagline: "Turn video into structured data",
    description:
      "A research-grade pipeline that breaks a video into machine-learnable features: Whisper transcription with diarization, scene detection, keyframes, pacing, and embeddings (planned).",
    tags: ["Open source", "Whisper", "Pipeline"],
    status: "Open source",
    href: "/tools/media-analysis",
    cta: "Learn more",
  },
];
