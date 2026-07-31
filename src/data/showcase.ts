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
    tagline: "Agents that run a business",
    description:
      "A platform that gives non-technical business owners a fleet of agents that operate and grow their business. React 19 + TypeScript frontend talking to 11 backend microservices through a single gateway. Every agent runs under a spending ceiling and a permission scope its owner sets. This is the system that runs my own companies.",
    tags: ["Agent platform", "React 19", "Microservices", "SaaS"],
    status: "Live",
    href: "https://agentlandos.com",
    cta: "Visit agentlandos.com",
    image: "/project-shots/agentland-os-cover.png",
    featured: true,
  },
  {
    title: "Fake Money",
    tagline: "Decentralized financial intelligence",
    description:
      "A trading workspace where every member runs their own prompts, shares analysis with the club, and connects their own broker. Scanner strategies on automated schedules, agent-written signal theses and daily retrospectives, and live real-money trading behind ~2,200 tests. The intelligence isn't in the model — it's in the people using it.",
    tags: ["Quant", "FastAPI", "Agents", "Live trading"],
    status: "Live",
    href: "https://www.fakemoney.club",
    cta: "Visit fakemoney.club",
    featured: true,
  },
  {
    title: "Yard Line",
    tagline: "Support for families on the outside",
    description:
      "A platform for families staying connected to someone who is incarcerated, and for people coming home. Every open correctional facility in the country is searchable, with guides for visiting, phone and video calls, and sending money — plus a reentry directory of housing, legal aid, bail funds, and work, each entry carrying the date it was last verified.",
    tags: ["Civic tech", "PostgreSQL", "Real-time", "Mapbox"],
    status: "Live",
    href: "https://yardlinechat.com",
    cta: "Visit yardlinechat.com",
    featured: true,
  },
  {
    title: "Detroit Small Business Map",
    tagline: "A directory that fills in its own gaps",
    description:
      "A map of Detroit's small businesses that discovers and enriches its own listings. New businesses land in staging, get filled in automatically from a dozen external sources, and publish themselves once they clear a quality bar. A second pipeline reads local news and drafts neighborhood stories for a human to approve.",
    tags: ["Data pipeline", "PostGIS", "Astro", "Gemini"],
    status: "Live",
    href: "https://www.detroitsmallbusinessmap.com",
    cta: "Visit detroitsmallbusinessmap.com",
    featured: true,
  },
  {
    title: "Bags of Laundry",
    tagline: "Laundry pickup and delivery in Detroit",
    description:
      "A three-sided marketplace connecting households, partner laundromats, and drivers. Because nobody knows what a load weighs at booking, the payment flow holds an authorization, captures the real amount after weighing, and re-authorizes holds before they expire — with anything that doesn't reconcile written to an anomalies table rather than a log.",
    tags: ["Marketplace", "Stripe", "Astro", "Logistics"],
    status: "Live",
    href: "https://bagsoflaundry.com",
    cta: "Visit bagsoflaundry.com",
    featured: true,
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
    tagline: "Mission control for your coding agents",
    description:
      "A real-time observability dashboard for Claude Code and Gemini CLI. Captures hook events, streams them over WebSocket, and shows a live feed with agent tracking, transcripts, analytics, and LLM-powered evaluation.",
    tags: ["Open source", "Claude Code", "Observability"],
    status: "Open source",
    href: "/tools/observability",
    cta: "Learn more",
  },
  {
    title: "Spec-Driven Docs",
    tagline: "Keep docs in sync with agent-written code",
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
