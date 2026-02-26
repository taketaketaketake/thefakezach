export interface Project {
  title: string;
  emoji: string;
  image?: string;
  imagePosition?: string;
  year: string;
  summary: string;
  spark: string;
  whatItDoes: string;
  tech: string[];
  status: "shipped" | "in-progress" | "archived";
  featured: boolean;
  link: string;
  github: string;
}

export const projects: Project[] = [
  {
    title: "Spec-Driven Development Template",
    emoji: "📋",
    image: "https://pub-7237b0e442304806ab3b8f7c4497b5de.r2.dev/4c662ab5-aaff-4ee5-b32e-2a89c6806e99-0.jpg",
    imagePosition: "left center",
    year: "2026",
    summary: "Documentation templates for spec-driven development of AI-native systems.",
    spark: "While building multi-agent systems, I kept hitting the same wall: agents behaving unpredictably without clear contracts. I needed a way to define how LLMs should reason about systems before writing any code.",
    whatItDoes: "A repository of structured documentation templates that serve as contracts for LLM reasoning. Includes governance structures for agent architectures, enforcement via Claude Code skills, ADR templates, phase auditing, health monitoring, and synchronized documentation workflows.",
    tech: ["Markdown", "Claude Code Skills", "ADR Templates", "Mermaid Diagrams"],
    status: "shipped",
    featured: true,
    link: "",
    github: "https://github.com/taketaketaketake/agentland-docs"
  },
  {
    title: "Detroit Small Business Map",
    emoji: "🗺️",
    image: "/projects/detroit-small-biz-cover-photo.png",
    year: "2025",
    summary: "A comprehensive business discovery platform connecting Detroit's local community with neighborhood businesses.",
    spark: "Detroit has incredible local businesses, but no good way to find them. Existing platforms were too generic and missed what makes each neighborhood unique.",
    whatItDoes: "Full-stack business directory with interactive maps, verified data via Google Places API, social engagement features, role-based management, and cannabis industry compliance. Built for community connection, not just discovery.",
    tech: ["Astro 5", "TypeScript", "React", "PostgreSQL", "TailwindCSS", "Mapbox GL", "Google Places API", "Netlify"],
    status: "shipped",
    featured: true,
    link: "",
    github: "https://github.com/taketaketaketake/detroit-small-business-map"
  },
  {
    title: "Bags of Laundry",
    emoji: "🧺",
    image: "/projects/bags-cover-photo 2.png",
    year: "2025",
    summary: "An innovative laundry service platform connecting customers with local providers.",
    spark: "Watched a local laundromat struggle with phone orders and manual tracking. Thought: what if ordering laundry pickup was as easy as ordering food?",
    whatItDoes: "Full-stack laundry platform with AI-powered voice & messaging ordering, real-time capacity management, photo documentation workflows, and subscription pricing. Serves residential customers, Airbnb hosts, and commercial clients across 30+ Detroit suburbs.",
    tech: ["Astro", "React", "TypeScript", "Tailwind", "PostgreSQL", "Stripe", "Twilio (for now)", "Netlify", "Mapbox API"],
    status: "shipped",
    featured: true,
    link: "https://bagsoflaundry.com",
    github: "#"
  },
  {
    title: "Fix My Furnace",
    emoji: "🤖",
    image: "/projects/fix-my-furnace-cover-photo.png",
    year: "2025",
    summary: "HVAC service marketplace connecting Michigan homeowners with vetted contractors.",
    spark: "Michigan winters don't wait. After seeing friends get ripped off on furnace repairs, I wanted to build something that gave homeowners pricing transparency and connected them with contractors they could trust.",
    whatItDoes: "Multi-funnel lead generation platform with photo-based furnace diagnosis, $125 professional assessment flow, real contract-backed pricing transparency, automated lead routing, and a vetted statewide contractor network. Every funnel designed to convert and deliver better matches.",
    tech: ["Astro.js", "TypeScript", "TailwindCSS", "Supabase", "Mapbox API", "Netlify"],
    status: "shipped",
    featured: true,
    link: "https://fixmyfurnacedetroit.com",
    github: "#"
  },
  {
    title: "AI Voice Agents",
    emoji: "🗣️",
    year: "2025",
    summary: "Production voice AI systems handling real customer calls with sub-500ms response latency.",
    spark: "Businesses were missing calls after hours. Hiring 24/7 staff wasn't realistic. I wanted to see if AI could handle the first touch naturally enough that callers wouldn't hang up.",
    whatItDoes: "Production voice agents using Telnyx Voice API for ultra-low latency conversations. Handles inbound calls, collects customer info naturally, supports SMS/MMS follow-up, and logs all interactions. Built for service businesses across multiple industries.",
    tech: ["Node.js", "Express", "Telnyx", "SQLite", "Supabase"],
    status: "shipped",
    featured: true,
    link: "https://fixmyfurnacemi.com",
    github: "#"
  },
  {
    title: "Overflow",
    emoji: "📺",
    year: "2025",
    summary: "PPV livestream platform for exclusive live events and performances.",
    spark: "Wanted to create a platform where independent artists and creators could monetize live performances directly, without middlemen taking massive cuts.",
    whatItDoes: "Full-stack PPV platform with payment processing, live video infrastructure, and event management. Produces exclusive shows for independent artists and creators.",
    tech: ["Astro", "Tailwind CSS", "Stripe", "JWT"],
    status: "shipped",
    featured: true,
    link: "https://watchoverflow.com",
    github: "#"
  },
  {
    title: "Take Detroit",
    emoji: "🎬",
    image: "/projects/take-detroit-cupcakes.jpg",
    year: "2015",
    summary: "Detroit lifestyle brand and video production company. 100K+ followers, 25M+ video views.",
    spark: "Started creating videos showcasing Detroit before vertical video was the norm. Built it into a full video production business and city guide.",
    whatItDoes: "Video production company and Detroit city guide. Produced content for local businesses, events, and the Detroit community. Grew an audience of 100K+ followers across platforms with 25M+ video views. Operated until 2020.",
    tech: ["Video Production", "Live Streaming", "Social Media", "Content Strategy"],
    status: "archived",
    featured: false,
    link: "https://instagram.com/take.detroit",
    github: "#"
  },
  {
    title: "Cosmic Crew",
    emoji: "👨‍🚀",
    image: "/projects/cosmic-crew-image.png",
    year: "2025",
    summary: "Interactive educational web game teaching programming concepts through space exploration.",
    spark: "Wanted to teach my kids programming, but most tools felt rigid and boring. Figured we could learn together by building something fun — and I'd pick up Three.js and generative AI workflows along the way.",
    whatItDoes: "Interactive prototype where kids direct a rocket through space using basic movement commands. Built with Three.js, WebGL, and 3D models I created using ComfyUI. More learning project than finished platform — we're still experimenting together.",
    tech: ["JavaScript", "Three.js", "WebGL", "CSS3D", "HTML5", "Tailwind CSS", "GLTF/GLB 3D Models"],
    status: "in-progress",
    featured: true,
    link: "https://cosmiccrew.club/",
    github: "#"
  }
];
