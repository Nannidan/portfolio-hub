import type { Project, ThemeId, ThemeMeta } from '../types/hub'

export const PROJECTS: Project[] = [
  {
    id: 'neonsynth',
    code: 'STAGE 01',
    title: 'AUDIOSYNTH // HZ',
    tagline: 'Browser Modular Synthesizer & JamesDSP Mastering',
    description:
      'Real-time Web Audio API synthesizer and JamesDSP-inspired mastering rack with SVG rotary dials, Dynamic Bass Boost, Vacuum Tube Modelling, Stereo Widener, Convolver Reverb, DRC Limiter, 5-Band EQ, and 60fps FFT visualizer.',
    liveUrl: 'https://neonsynth-playground.vercel.app/',
    repoUrl: 'https://github.com/Nannidan/neonsynth-playground',
    tags: ['React 19', 'TypeScript', 'Web Audio DSP', 'JamesDSP Chain', 'Tailwind v4'],
    icon: 'synth',
  },
  {
    id: 'forge-ui',
    code: 'STAGE 02',
    title: 'FORGE // UI',
    tagline: 'Component Workbench & AI Prompt Studio',
    description:
      'Interactive React + Tailwind v4 design-token studio featuring Default/Loading/Disabled state simulation, live WCAG 2.1 contrast auditing, localStorage Component Vault CRUD, Undo/Redo history, and 3-format code export.',
    liveUrl: 'https://forge-ui-studio.vercel.app/',
    repoUrl: 'https://github.com/Nannidan/forge-ui-studio',
    tags: ['React 19', 'TypeScript', 'Tailwind v4', 'WCAG A11y', 'localStorage CRUD'],
    icon: 'forge',
  },
  {
    id: 'orbit-ops',
    code: 'STAGE 03',
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
    code: 'STAGE 04',
    title: 'LEDGERFLOW // SAAS',
    tagline: 'Light-Mode SaaS Revenue & Billing Dashboard',
    description:
      'Enterprise-style revenue and billing dashboard built in a clean light-mode design system featuring dynamic KPI cards, an interactive 30D/90D/12M revenue target chart, searchable and sortable invoice tables, a slide-over detail drawer, localStorage persistence, and one-click CSV export.',
    liveUrl: 'https://ledgerflow-saas-nine.vercel.app/',
    repoUrl: 'https://github.com/Nannidan/ledgerflow-saas',
    tags: ['React 19', 'TypeScript', 'Tailwind v4', 'localStorage CRUD', 'CSV Export'],
    icon: 'ledger',
  },
  {
    id: 'spectrum-lens',
    code: 'STAGE 05',
    title: 'SPECTRUM // LENS',
    tagline: 'Sensory-Friendly Epidemiology & Live Research APIs',
    description:
      'Autism-friendly, low-stimulation dashboard comparing 8 primary-sourced diagnosis, funding, DSM-5, equity, and misinformation datasets alongside live OpenAlex & ClinicalTrials.gov v2 APIs and an AI trait-reflection probability estimator.',
    liveUrl: 'https://nannidan.github.io/spectrum-lens/',
    repoUrl: 'https://github.com/Nannidan/spectrum-lens',
    tags: ['React 19', 'TypeScript', 'Live APIs', 'URL State Sync', 'Low-Stim UI'],
    icon: 'spectrum',
  },
]

export const THEME_META: Record<ThemeId, ThemeMeta> = {
  cyberpunk: {
    label: 'Cyberpunk',
    badge: 'NETRUNNER // PORTFOLIO HUB',
    headline: 'Select a live module to jack in.',
    sub: 'High-contrast interactive web apps engineered with React 19, TypeScript, and Tailwind CSS v4.',
  },
  mario: {
    label: 'Super Mario',
    badge: 'WORLD 1-1 // STAGE SELECT',
    headline: 'Choose a world to jump into!',
    sub: 'Power-up your review: launch a live interactive web app below or inspect the source code.',
  },
  kpop: {
    label: 'KPop Demon Hunters',
    badge: 'HUNTER STAGE // ENCORE MODE',
    headline: 'Pick your spotlight & slay the demo.',
    sub: 'Stage-ready front-end engineering blending razor-sharp UI systems with interactive browser APIs.',
  },
}
