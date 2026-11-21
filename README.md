# Daniel Nanninga — Front-End & Creative UI Engineering Portfolio Hub

[![CI](https://github.com/Nannidan/portfolio-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/Nannidan/portfolio-hub/actions)
**Live Hub:** [https://portfolio-hub-44jc.vercel.app/](https://portfolio-hub-44jc.vercel.app/)

Central launchpad showcasing 5 production React 19 + TypeScript + Tailwind CSS v4 applications spanning real-time Web Audio DSP, design-system tooling, live space/epidemiology telemetry, and enterprise SaaS dashboards.

---

## Featured Applications

| Stage | Project | Domain & Highlights | Live Demo | Source |
| :--- | :--- | :--- | :--- | :--- |
| **STAGE 01** | **AUDIOSYNTH // HZ** | Web Audio API synthesizer + JamesDSP mastering chain (Dynamic Bass, Vacuum Tube, Stereo Widener, Convolver Reverb, DRC, 5-Band EQ) & 60fps FFT visualizer | [Live App](https://neonsynth-playground.vercel.app/) | [GitHub](https://github.com/Nannidan/neonsynth-playground) |
| **STAGE 02** | **FORGE // UI** | Component workbench & AI prompt studio with live WCAG 2.1 contrast auditing, state simulator, Undo/Redo stack, and 3-format code export | [Live App](https://forge-ui-studio.vercel.app/) | [GitHub](https://github.com/Nannidan/forge-ui-studio) |
| **STAGE 03** | **ORBIT // OPS** | Deep-space logarithmic radar tracking Voyager 1 & 2, JWST, Hubble, live 5s ISS telemetry, and NASA Near-Earth Asteroids | [Live App](https://orbit-ops-theta.vercel.app/) | [GitHub](https://github.com/Nannidan/orbit-ops) |
| **STAGE 04** | **LEDGERFLOW // SAAS** | Enterprise light-mode SaaS revenue & billing dashboard with 30D/90D/12M target chart, invoice drawer, `localStorage` CRUD, and CSV export | [Live App](https://ledgerflow-saas-nine.vercel.app/) | [GitHub](https://github.com/Nannidan/ledgerflow-saas) |
| **STAGE 05** | **SPECTRUM // LENS** | Sensory-friendly autism epidemiology & funding telemetry dashboard with live OpenAlex & ClinicalTrials.gov APIs and AI trait-reflection estimator | [Live App](https://nannidan.github.io/spectrum-lens/) | [GitHub](https://github.com/Nannidan/spectrum-lens) |

---

## Key Engineering Highlights in This Hub

- **Multi-Axis Theme Engine (`data-theme`, `data-mode`, `data-style`):** Instant zero-flash switching across 3 color palettes (*Cyberpunk*, *Super Mario*, *KPop Demon Hunters*), *Day/Night* lighting modes, and *Modern vs. 8-Bit Retro* typography/geometry.
- **Interactive `<DynamicAvatar />` Component:** Dual-layer cross-fade morphing between photorealistic and pixel-art portraits on hover/style toggle, 3D pointer tilt with specular glare, 6 click-to-cycle CSS/blend-mode style variants (`AUTO`, `HOLO`, `CRT`, `NEON`, `NOIR`, `8-BIT`), and a `requestAnimationFrame` HTML5 `<canvas>` particle layer respecting `prefers-reduced-motion`.
- **Strict Tooling:** React 19, TypeScript (`tsc -b`), Tailwind CSS v4, Vite 8, and `oxlint` (0 warnings, 0 errors).

## Local Development

```bash
npm install
npm run dev
npm run lint
npm run build
```
