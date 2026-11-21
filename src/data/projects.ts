import type { Project, ThemeId, ThemeMeta } from '../types/hub'

export const PROJECTS: Project[] = [
  {
    id: 'neonsynth',
    code: 'PROJECT 01',
    title: 'AUDIOSYNTH // HZ',
    tagline: 'Browser Modular Synthesizer & Multimodal Mastering DSP',
    description:
      'Real-time Web Audio API synthesizer and studio mastering rack with SVG rotary dials, Dynamic Bass Boost, Vacuum Tube Saturation, Haas Stereo Widener, Convolver Reverb, DRC Limiter, 5-Band EQ, and 60fps FFT visualizer.',
    liveUrl: 'https://neonsynth-playground.vercel.app/',
    repoUrl: 'https://github.com/Nannidan/neonsynth-playground',
    tags: ['React 19', 'TypeScript', 'Web Audio DSP', '5-Band EQ & Tube', 'Tailwind v4'],
    icon: 'synth',
  },
  {
    id: 'forge-ui',
    code: 'PROJECT 02',
    title: 'FORGE // UI',
    tagline: 'Component Workbench, WCAG Auditor & AI Prompt Studio',
    description:
      'Interactive React + Tailwind v4 design-token studio featuring Default/Loading/Disabled state simulation, live WCAG 2.1 contrast auditing, localStorage Component Vault CRUD, Undo/Redo history, and 3-format code export.',
    liveUrl: 'https://forge-ui-studio.vercel.app/',
    repoUrl: 'https://github.com/Nannidan/forge-ui-studio',
    tags: ['React 19', 'TypeScript', 'Tailwind v4', 'WCAG A11y', 'localStorage CRUD'],
    icon: 'forge',
  },
  {
    id: 'orbit-ops',
    code: 'PROJECT 03',
    title: 'ORBIT // OPS',
    tagline: 'Live Voyager, ISS & Deep-Space Telemetry',
    description:
      'Real-time space dashboard tracking Voyager 1 & 2, New Horizons, JWST, and Hubble on a logarithmic radar alongside live 5s ISS orbital tracking, NASA Near-Earth Asteroids, and upcoming launches.',
    liveUrl: 'https://orbit-ops-theta.vercel.app/',
    repoUrl: 'https://github.com/Nannidan/orbit-ops',
    tags: ['React 19', 'TypeScript', 'Live REST APIs', 'SVG Telemetry', 'Tailwind v4'],
    icon: 'orbit',
  },
  {
    id: 'ledgerflow',
    code: 'PROJECT 04',
    title: 'LEDGERFLOW // SAAS',
    tagline: 'Enterprise SaaS Revenue & Billing Operations',
    description:
      'Enterprise-style revenue and billing dashboard built in a clean light-mode design system featuring dynamic KPI cards, an interactive 30D/90D/12M revenue target chart, searchable and sortable invoice tables, a slide-over detail drawer, localStorage persistence, and one-click CSV export.',
    liveUrl: 'https://ledgerflow-saas-nine.vercel.app/',
    repoUrl: 'https://github.com/Nannidan/ledgerflow-saas',
    tags: ['React 19', 'TypeScript', 'Tailwind v4', 'localStorage CRUD', 'CSV Export'],
    icon: 'ledger',
  },
  {
    id: 'nexus-dag',
    code: 'PROJECT 05',
    title: 'NEXUS // DAG',
    tagline: '2D Spatial Node-Graph & Topological Pipeline Engine',
    description:
      'Interactive 2D spatial workflow canvas with pointer-captured node dragging, cubic Bézier SVG wire routing, DFS cycle prevention, Kahn’s level-order topological DAG execution solver, live token/latency trace inspector, and JSON export.',
    liveUrl: 'https://nannidan.github.io/nexus-dag/',
    repoUrl: 'https://github.com/Nannidan/nexus-dag',
    tags: ['React 19', 'TypeScript', '2D Node Graph', 'Topological Solver', 'SVG Bézier'],
    icon: 'nexus',
  },
  {
    id: 'verlet-lab',
    code: 'PROJECT 06',
    title: 'VERLET // LAB',
    tagline: '60fps 2D Verlet Physics & Constraint Relaxation Engine',
    description:
      'Real-time HTML5 Canvas numerical physics simulator implementing symplectic Verlet integration, iterative Gauss-Seidel constraint relaxation, tensile strain color-mapping, dynamic link fracture, 3 interactive pointer force tools, and a live frame-time profiler.',
    liveUrl: 'https://nannidan.github.io/verlet-lab/',
    repoUrl: 'https://github.com/Nannidan/verlet-lab',
    tags: ['React 19', 'TypeScript', 'HTML5 Canvas 60fps', 'Verlet Physics', 'Gauss-Seidel'],
    icon: 'verlet',
  },
]

const HERO_COPY = {
  badge: 'DANIEL NANNINGA // FRONT-END & AI UI ENGINEER',
  headline: 'Production Front-End & Interactive UI Systems.',
  sub: 'Six shipped web applications engineered with React 19, TypeScript, and Tailwind CSS v4—spanning Web Audio DSP, design-system accessibility, live telemetry, SaaS workflows, 2D node-graph DAG engines, and 60fps Canvas physics.',
}

export const THEME_META: Record<ThemeId, ThemeMeta> = {
  slate: {
    label: 'Obsidian & Cyan',
    swatch: '#0ea5e9',
    ...HERO_COPY,
  },
  emerald: {
    label: 'Nordic Emerald',
    swatch: '#10b981',
    ...HERO_COPY,
  },
  indigo: {
    label: 'Executive Indigo',
    swatch: '#6366f1',
    ...HERO_COPY,
  },
}
