(() => {
  if (document.getElementById('forge-ui-universal-drawer')) return;

  const STORAGE_KEY = 'forge_ui_live_tokens_v6';

  const PRESETS = {
    ocean: {
      name: 'Ocean Blue',
      accent: '#38bdf8',
      accent2: '#6366f1',
      canvas: '#040814',
      bg: '#0b1324',
      fg: '#f0f9ff',
      muted: '#94a3b8',
    },
    emerald: {
      name: 'Emerald Green',
      accent: '#10b981',
      accent2: '#38bdf8',
      canvas: '#030b08',
      bg: '#071914',
      fg: '#ecfdf5',
      muted: '#86efac',
    },
    indigo: {
      name: 'Royal Indigo',
      accent: '#818cf8',
      accent2: '#c084fc',
      canvas: '#060513',
      bg: '#0f0e26',
      fg: '#eef2ff',
      muted: '#a5b4fc',
    },
    amber: {
      name: 'Sunset Amber',
      accent: '#f59e0b',
      accent2: '#ef4444',
      canvas: '#0d0702',
      bg: '#1c1106',
      fg: '#fffbeb',
      muted: '#fcd34d',
    },
    ruby: {
      name: 'Ruby Red',
      accent: '#f43f5e',
      accent2: '#fb923c',
      canvas: '#0f0307',
      bg: '#1f0910',
      fg: '#fff1f2',
      muted: '#fda4af',
    },
    violet: {
      name: 'Violet Purple',
      accent: '#c084fc',
      accent2: '#38bdf8',
      canvas: '#090312',
      bg: '#160a28',
      fg: '#faf5ff',
      muted: '#d8b4fe',
    },
    mint: {
      name: 'Forest Mint',
      accent: '#22c55e',
      accent2: '#10b981',
      canvas: '#020804',
      bg: '#06150a',
      fg: '#dcfce7',
      muted: '#86efac',
    },
    cobalt: {
      name: 'Deep Cobalt',
      accent: '#0ea5e9',
      accent2: '#3b82f6',
      canvas: '#020a16',
      bg: '#07172e',
      fg: '#e0f2fe',
      muted: '#7dd3fc',
    },
    coral: {
      name: 'Coral Pink',
      accent: '#fb7185',
      accent2: '#f59e0b',
      canvas: '#11050b',
      bg: '#210c16',
      fg: '#ffe4e6',
      muted: '#fda4af',
    },
    slate: {
      name: 'Slate Gray',
      accent: '#e2e8f0',
      accent2: '#94a3b8',
      canvas: '#08090d',
      bg: '#12151e',
      fg: '#f8fafc',
      muted: '#94a3b8',
    },
    daylight: {
      name: 'Daylight White',
      accent: '#0284c7',
      accent2: '#4f46e5',
      canvas: '#f1f5f9',
      bg: '#ffffff',
      fg: '#0f172a',
      muted: '#475569',
    },
    oled: {
      name: 'Pure Black',
      accent: '#00f0ff',
      accent2: '#ffffff',
      canvas: '#000000',
      bg: '#050505',
      fg: '#ffffff',
      muted: '#cbd5e1',
    },
  };

  const ACCENT_SWATCHES = [
    { hex: '#38bdf8', name: 'Sky Blue' },
    { hex: '#00f0ff', name: 'Electric Cyan' },
    { hex: '#0ea5e9', name: 'Ocean Blue' },
    { hex: '#3b82f6', name: 'Royal Blue' },
    { hex: '#6366f1', name: 'Indigo' },
    { hex: '#818cf8', name: 'Soft Indigo' },
    { hex: '#a855f7', name: 'Purple' },
    { hex: '#c084fc', name: 'Lavender' },
    { hex: '#ec4899', name: 'Hot Pink' },
    { hex: '#f43f5e', name: 'Ruby Rose' },
    { hex: '#fb7185', name: 'Coral Pink' },
    { hex: '#ef4444', name: 'Crimson Red' },
    { hex: '#f97316', name: 'Bright Orange' },
    { hex: '#f59e0b', name: 'Warm Amber' },
    { hex: '#eab308', name: 'Sun Gold' },
    { hex: '#84cc16', name: 'Lime Green' },
    { hex: '#22c55e', name: 'Fresh Green' },
    { hex: '#10b981', name: 'Emerald' },
    { hex: '#14b8a6', name: 'Teal' },
    { hex: '#ffffff', name: 'Pure White' },
  ];

  const SURFACE_SWATCHES = [
    { label: 'Pure Black', canvas: '#000000', bg: '#050508', fg: '#ffffff' },
    { label: 'Dark Navy', canvas: '#040814', bg: '#0b1324', fg: '#f0f9ff' },
    { label: 'Midnight Blue', canvas: '#020a16', bg: '#07172e', fg: '#e0f2fe' },
    { label: 'Deep Forest', canvas: '#030b08', bg: '#071914', fg: '#ecfdf5' },
    { label: 'Dark Indigo', canvas: '#060513', bg: '#0f0e26', fg: '#eef2ff' },
    { label: 'Dark Plum', canvas: '#090312', bg: '#160a28', fg: '#faf5ff' },
    { label: 'Deep Crimson', canvas: '#0f0307', bg: '#1f0910', fg: '#fff1f2' },
    { label: 'Warm Espresso', canvas: '#0d0702', bg: '#1c1106', fg: '#fffbeb' },
    { label: 'Charcoal Gray', canvas: '#090b10', bg: '#151922', fg: '#f8fafc' },
    { label: 'Light Mode', canvas: '#f1f5f9', bg: '#ffffff', fg: '#0f172a' },
  ];

  const DEFAULTS = {
    preset: 'ocean',
    accent: '#38bdf8',
    accent2: '#6366f1',
    canvas: '#040814',
    bg: '#0b1324',
    fg: '#f0f9ff',
    muted: '#94a3b8',
    radius: 14,
    glow: 22,
    borderAlpha: 38,
    kind: 'button',
    state: 'default',
    label: 'Launch App',
    sub: 'Live design tokens, accessible contrast, and responsive styling.',
    exportTab: 'css',
    applyToPage: false,
  };

  let state = { ...DEFAULTS };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') state = { ...DEFAULTS, ...saved };
  } catch {}

  function hexToRgb(hex) {
    const h = (hex || '#38bdf8').replace('#', '').trim();
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const n = parseInt(full, 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(hex, alpha) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  function lum([r, g, b]) {
    const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function contrastRatio(h1, h2) {
    const l1 = lum(hexToRgb(h1)), l2 = lum(hexToRgb(h2));
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  document.querySelectorAll('a[href="/forge-studio.html"], a[href="./forge-studio.html"]').forEach(el => {
    if (el.textContent && el.textContent.includes('FORGE')) el.remove();
  });

  const styleEl = document.createElement('style');
  styleEl.id = 'forge-ui-universal-styles';
  styleEl.textContent = `
    #forge-ui-universal-btn {
      position: fixed;
      left: 14px;
      bottom: 14px;
      z-index: 9998;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 15px;
      border-radius: 999px;
      background: rgba(6, 11, 22, 0.94);
      color: var(--forge-live-accent, #38bdf8);
      border: 1.5px solid var(--forge-live-accent, #38bdf8);
      box-shadow: 0 0 20px var(--forge-live-glow, rgba(56, 189, 248, 0.35));
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.4px;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: transform 150ms ease, box-shadow 150ms ease;
    }
    #forge-ui-universal-btn:hover {
      transform: translateY(-1px) scale(1.02);
    }
    #forge-ui-universal-btn .f-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--forge-live-accent, #38bdf8);
      box-shadow: 0 0 8px var(--forge-live-accent, #38bdf8);
    }
    #forge-ui-universal-drawer {
      position: fixed;
      left: 14px;
      bottom: 56px;
      z-index: 9999;
      width: min(440px, calc(100vw - 28px));
      max-height: min(84vh, 740px);
      overflow-y: auto;
      background: rgba(7, 11, 21, 0.97);
      color: #eef7ff;
      border: 1.5px solid var(--forge-live-accent, #38bdf8);
      border-radius: 16px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.88), 0 0 32px var(--forge-live-glow, rgba(56, 189, 248, 0.25));
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      padding: 14px;
      display: none;
      flex-direction: column;
      gap: 11px;
      backdrop-filter: blur(16px);
    }
    #forge-ui-universal-drawer.open {
      display: flex;
    }
    .f-row { display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap; }
    .f-title { font-size: 10.5px; font-weight: 800; color: var(--forge-live-accent, #38bdf8); text-transform: uppercase; letter-spacing: 0.5px; }
    .f-preset-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
    }
    .f-btn {
      font-family: inherit;
      font-size: 10px;
      color: #dbeafe;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 7px;
      padding: 5px 7px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: border-color 140ms ease, background 140ms ease, transform 100ms ease;
    }
    .f-btn:hover { border-color: var(--forge-live-accent, #38bdf8); color: #ffffff; }
    .f-btn:active { transform: scale(0.96); }
    .f-btn.active {
      border-color: var(--forge-live-accent, #38bdf8);
      color: var(--forge-live-accent, #38bdf8);
      background: rgba(56, 189, 248, 0.14);
      font-weight: 700;
    }
    .f-swatch-row {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      align-items: center;
    }
    .f-swatch {
      width: 21px;
      height: 21px;
      border-radius: 6px;
      border: 1.5px solid rgba(255, 255, 255, 0.22);
      cursor: pointer;
      padding: 0;
      transition: transform 120ms ease, border-color 120ms ease;
    }
    .f-swatch:hover { transform: scale(1.14); border-color: #ffffff; }
    .f-swatch.active {
      border: 2px solid #ffffff;
      box-shadow: 0 0 10px currentColor;
      transform: scale(1.12);
    }
    .f-surf-swatch {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 7px;
      border-radius: 6px;
      font-size: 9.5px;
      font-family: inherit;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(255, 255, 255, 0.04);
      color: #cbd5e1;
    }
    .f-surf-swatch:hover, .f-surf-swatch.active {
      border-color: var(--forge-live-accent, #38bdf8);
      color: #ffffff;
    }
    .f-select, .f-input, .f-code {
      font-family: inherit;
      font-size: 10.5px;
      color: #eef7ff;
      background: #030711;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 7px;
      padding: 5px 8px;
    }
    .f-stage {
      min-height: 96px;
      background: #030711;
      border: 1px dashed rgba(255, 255, 255, 0.18);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      position: relative;
    }
    .f-wcag {
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 999px;
      font-weight: 700;
      border: 1px solid #34d399;
      color: #34d399;
    }
    .f-code {
      width: 100%;
      min-height: 84px;
      resize: vertical;
      color: #bae6fd;
      line-height: 1.4;
    }
  `;
  document.head.appendChild(styleEl);

  const pageThemeStyle = document.createElement('style');
  pageThemeStyle.id = 'forge-ui-live-page-overrides';
  document.head.appendChild(pageThemeStyle);

  const triggerBtn = document.createElement('button');
  triggerBtn.id = 'forge-ui-universal-btn';
  triggerBtn.type = 'button';
  triggerBtn.innerHTML = `<span class="f-dot"></span><span>Theme &amp; UI Studio</span>`;

  const presetButtonsHtml = Object.entries(PRESETS)
    .map(([key, p]) => {
      return `<button type="button" class="f-btn" data-preset="${key}">
        <span style="width:8px;height:8px;border-radius:50%;background:${p.accent};box-shadow:0 0 6px ${p.accent};flex-shrink:0;"></span>
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.name}</span>
      </button>`;
    })
    .join('');

  const accentSwatchesHtml = ACCENT_SWATCHES.map(s => {
    return `<button type="button" class="f-swatch" data-accent-swatch="${s.hex}" title="${s.name} (${s.hex})" style="background:${s.hex};color:${s.hex};"></button>`;
  }).join('');

  const surfaceSwatchesHtml = SURFACE_SWATCHES.map((s, idx) => {
    return `<button type="button" class="f-surf-swatch" data-surf-idx="${idx}" title="${s.label}">
      <span style="width:10px;height:10px;border-radius:3px;background:${s.bg};border:1px solid ${s.fg};"></span>
      <span>${s.label}</span>
    </button>`;
  }).join('');

  const drawer = document.createElement('aside');
  drawer.id = 'forge-ui-universal-drawer';
  drawer.setAttribute('aria-label', 'Forge UI Theme & Styling Studio');
  drawer.innerHTML = `
    <div class="f-row" style="border-bottom:1px solid rgba(255,255,255,0.12);padding-bottom:8px;">
      <div>
        <div style="font-size:12px;font-weight:800;color:#fff;">Forge <span style="color:var(--forge-live-accent,#38bdf8)">UI Studio</span></div>
        <div style="font-size:9.5px;color:#8ca2c0;">Live Page Theme &amp; Component Styler</div>
      </div>
      <div class="f-row">
        <button type="button" class="f-btn" id="f-reset-page-btn" title="Restore original page appearance">Reset Default</button>
        <a href="./forge-studio.html" class="f-btn" title="Open Full-Screen UI Studio">Full Studio &#8599;</a>
        <button type="button" class="f-btn" id="f-close-btn" aria-label="Close UI Studio">&times;</button>
      </div>
    </div>

    <div>
      <div class="f-row" style="margin-bottom:5px;">
        <span class="f-title">Theme Presets</span>
        <span id="f-wcag-pill" class="f-wcag">Contrast: 15.8:1 (AAA)</span>
      </div>
      <div class="f-preset-grid" id="f-presets">
        ${presetButtonsHtml}
      </div>
    </div>

    <div>
      <div class="f-row" style="margin-bottom:5px;">
        <span class="f-title">Accent Color Swatches</span>
        <label style="font-size:9.5px;color:#94a3b8;">Custom Color <input type="color" id="f-accent" style="vertical-align:middle;width:22px;height:18px;border:0;background:none;cursor:pointer;" /></label>
      </div>
      <div class="f-swatch-row" id="f-accent-swatches">
        ${accentSwatchesHtml}
      </div>
    </div>

    <div>
      <div class="f-row" style="margin-bottom:5px;">
        <span class="f-title">Background &amp; Card Colors</span>
        <div style="display:flex;gap:6px;align-items:center;">
          <label style="font-size:9.5px;color:#94a3b8;">Page Bg <input type="color" id="f-canvas" style="vertical-align:middle;width:20px;height:17px;border:0;background:none;cursor:pointer;" /></label>
          <label style="font-size:9.5px;color:#94a3b8;">Card Bg <input type="color" id="f-bg" style="vertical-align:middle;width:20px;height:17px;border:0;background:none;cursor:pointer;" /></label>
          <label style="font-size:9.5px;color:#94a3b8;">Text <input type="color" id="f-fg" style="vertical-align:middle;width:20px;height:17px;border:0;background:none;cursor:pointer;" /></label>
        </div>
      </div>
      <div class="f-swatch-row" id="f-surface-swatches">
        ${surfaceSwatchesHtml}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
      <label style="font-size:9.5px;color:#94a3b8;">Corner Rounding: <span id="f-rad-val" style="color:#fff;">14px</span>
        <input type="range" id="f-rad" min="0" max="28" style="width:100%;accent-color:var(--forge-live-accent,#38bdf8);" />
      </label>
      <label style="font-size:9.5px;color:#94a3b8;">Shadow &amp; Glow: <span id="f-glow-val" style="color:#fff;">22px</span>
        <input type="range" id="f-glow" min="0" max="44" style="width:100%;accent-color:var(--forge-live-accent,#38bdf8);" />
      </label>
      <label style="font-size:9.5px;color:#94a3b8;">Border Strength: <span id="f-bdr-val" style="color:#fff;">38%</span>
        <input type="range" id="f-bdr" min="10" max="95" style="width:100%;accent-color:var(--forge-live-accent,#38bdf8);" />
      </label>
    </div>

    <div class="f-row">
      <select id="f-kind" class="f-select" style="flex:1;">
        <option value="button">Element: Button</option>
        <option value="card">Element: Feature Card</option>
        <option value="badge">Element: Status Badge</option>
      </select>
      <select id="f-state" class="f-select" style="flex:1;">
        <option value="default">State: Normal</option>
        <option value="loading">State: Loading</option>
        <option value="disabled">State: Disabled</option>
      </select>
      <button type="button" class="f-btn active" id="f-live-page-toggle" title="Apply theme across the entire page">Apply to Page: ON</button>
    </div>

    <div class="f-stage" id="f-stage-mount"></div>

    <div>
      <div class="f-row" style="margin-bottom:5px;">
        <div class="f-row">
          <button type="button" class="f-btn" data-exp="css">CSS Variables</button>
          <button type="button" class="f-btn" data-exp="jsx">React Code</button>
          <button type="button" class="f-btn" data-exp="prompt">AI Prompt</button>
        </div>
        <button type="button" class="f-btn active" id="f-copy-btn">Copy Code</button>
      </div>
      <textarea id="f-code-out" class="f-code" readonly spellcheck="false"></textarea>
    </div>
  `;

  document.body.appendChild(triggerBtn);
  document.body.appendChild(drawer);

  function buildWholeProjectCss() {
    if (!state.applyToPage) return '';
    const bdrColor = rgba(state.accent, (state.borderAlpha || 38) / 100);
    const softAccent = rgba(state.accent, 0.15);
    const glowColor = rgba(state.accent, 0.28);
    const cardShadow = state.glow > 0 ? `0 10px ${state.glow}px -4px ${rgba(state.accent, 0.25)}` : 'none';

    return `
      :root, html, body, [data-theme] {
        --bg: ${state.canvas} !important;
        --surface: ${state.bg} !important;
        --surface-alt: ${state.canvas} !important;
        --ink: ${state.fg} !important;
        --muted: ${state.muted || '#94a3b8'} !important;
        --accent: ${state.accent} !important;
        --accent-soft: ${softAccent} !important;
        --border: ${bdrColor} !important;
        --glow: ${glowColor} !important;
        --color-canvas: ${state.canvas} !important;
        --color-surface: ${state.bg} !important;
        --color-ink: ${state.fg} !important;
        --color-muted: ${state.muted || '#94a3b8'} !important;
        --color-accent: ${state.accent} !important;
        --color-edge: ${bdrColor} !important;
      }

      html, body, #root, #root > div, main {
        background-color: ${state.canvas} !important;
        color: ${state.fg} !important;
        transition: background-color 200ms ease, color 200ms ease;
      }

      header.sticky, nav.sticky, #root header {
        background-color: ${rgba(state.bg, 0.9)} !important;
        border-color: ${bdrColor} !important;
      }

      #root article,
      #root section > div[class*="rounded-"],
      #root main > div[class*="rounded-"],
      #root main > section[class*="rounded-"],
      #root aside,
      .tel-card,
      #root [class*="bg-slate-950"],
      #root [class*="bg-slate-900"],
      #root [class*="bg-zinc-900"],
      #root [class*="bg-white"],
      #root [class*="bg-surface"] {
        background-color: ${state.bg} !important;
        color: ${state.fg} !important;
        border-color: ${bdrColor} !important;
        border-radius: ${state.radius}px !important;
        box-shadow: ${cardShadow} !important;
        transition: background-color 180ms ease, border-color 180ms ease, border-radius 180ms ease, box-shadow 180ms ease;
      }

      #root input:not([type="range"]):not([type="color"]),
      #root select,
      #root textarea,
      #root [class*="bg-slate-950/"],
      #root [class*="bg-slate-900/"],
      #root [class*="bg-canvas"] {
        background-color: ${rgba(state.canvas, 0.82)} !important;
        color: ${state.fg} !important;
        border-color: ${bdrColor} !important;
        border-radius: ${Math.max(4, Math.round(state.radius * 0.72))}px !important;
      }

      #root h1, #root h2, #root h3, #root h4,
      #root [class*="text-white"],
      #root [class*="text-slate-900"],
      #root [class*="text-slate-100"],
      #root [class*="text-zinc-100"],
      #root [class*="text-ink"] {
        color: ${state.fg} !important;
      }

      #root [class*="text-cyan-"],
      #root [class*="text-sky-"],
      #root [class*="text-emerald-4"],
      #root [class*="text-emerald-3"],
      #root [class*="text-indigo-6"],
      #root [class*="text-indigo-4"],
      #root [class*="text-accent"] {
        color: ${state.accent} !important;
      }

      #root [class*="bg-cyan-500"]:not([class*="bg-cyan-500/"]),
      #root [class*="bg-sky-500"]:not([class*="bg-sky-500/"]),
      #root [class*="bg-emerald-500"]:not([class*="bg-emerald-500/"]),
      #root [class*="bg-indigo-600"]:not([class*="bg-indigo-600/"]),
      #root [class*="bg-accent"]:not([class*="bg-accent/"]) {
        background-color: ${state.accent} !important;
        color: #020617 !important;
        border-color: ${state.accent} !important;
        box-shadow: 0 4px ${Math.max(8, state.glow)}px ${rgba(state.accent, 0.4)} !important;
      }

      #root [class*="bg-cyan-500/"],
      #root [class*="bg-sky-500/"],
      #root [class*="bg-emerald-500/"],
      #root [class*="bg-indigo-50"],
      #root [class*="bg-emerald-50"],
      #root [class*="bg-accent/"] {
        background-color: ${softAccent} !important;
        border-color: ${bdrColor} !important;
        color: ${state.accent} !important;
      }

      #root [class*="border-slate-"],
      #root [class*="border-zinc-"],
      #root [class*="border-cyan-"],
      #root [class*="border-sky-"],
      #root [class*="border-emerald-"],
      #root [class*="border-edge"] {
        border-color: ${bdrColor} !important;
      }

      #root button:not([class*="rounded-full"]),
      #root a[class*="rounded-lg"],
      #root a[class*="rounded-xl"] {
        border-radius: ${Math.max(4, Math.round(state.radius * 0.75))}px !important;
      }

      #root input[type="range"] {
        accent-color: ${state.accent} !important;
      }

      #cosmos-launch-btn {
        color: ${state.accent} !important;
        border-color: ${state.accent} !important;
        box-shadow: 0 0 16px ${rgba(state.accent, 0.35)} !important;
      }
    `;
  }

  function render() {
    document.documentElement.style.setProperty('--forge-live-accent', state.accent);
    document.documentElement.style.setProperty('--forge-live-glow', rgba(state.accent, 0.35));

    document.getElementById('f-accent').value = state.accent;
    document.getElementById('f-canvas').value = state.canvas;
    document.getElementById('f-bg').value = state.bg;
    document.getElementById('f-fg').value = state.fg;
    document.getElementById('f-rad').value = state.radius;
    document.getElementById('f-glow').value = state.glow;
    document.getElementById('f-bdr').value = state.borderAlpha || 38;
    document.getElementById('f-rad-val').textContent = state.radius + 'px';
    document.getElementById('f-glow-val').textContent = state.glow + 'px';
    document.getElementById('f-bdr-val').textContent = (state.borderAlpha || 38) + '%';
    document.getElementById('f-kind').value = state.kind;
    document.getElementById('f-state').value = state.state;

    const pageBtn = document.getElementById('f-live-page-toggle');
    pageBtn.textContent = state.applyToPage ? 'Apply to Page: ON' : 'Apply to Page: OFF';
    pageBtn.classList.toggle('active', !!state.applyToPage);

    pageThemeStyle.textContent = buildWholeProjectCss();

    drawer.querySelectorAll('#f-presets button').forEach(b => {
      b.classList.toggle('active', b.dataset.preset === state.preset);
    });
    drawer.querySelectorAll('[data-accent-swatch]').forEach(b => {
      b.classList.toggle('active', b.dataset.accentSwatch.toLowerCase() === state.accent.toLowerCase());
    });
    drawer.querySelectorAll('[data-surf-idx]').forEach(b => {
      const s = SURFACE_SWATCHES[+b.dataset.surfIdx];
      b.classList.toggle('active', s && s.bg.toLowerCase() === state.bg.toLowerCase());
    });
    drawer.querySelectorAll('[data-exp]').forEach(b => {
      b.classList.toggle('active', b.dataset.exp === state.exportTab);
    });

    const cr = contrastRatio(state.fg, state.bg);
    const tier = cr >= 7 ? 'AAA' : cr >= 4.5 ? 'AA' : 'Low';
    const wcagEl = document.getElementById('f-wcag-pill');
    const col = cr >= 4.5 ? '#34d399' : '#fb7185';
    wcagEl.textContent = `Contrast: ${cr.toFixed(1)}:1 (${tier})`;
    wcagEl.style.color = col;
    wcagEl.style.borderColor = col;

    const mount = document.getElementById('f-stage-mount');
    const dis = state.state === 'disabled';
    const load = state.state === 'loading';
    const boxStyle = `background:${state.bg};color:${state.fg};border:1.5px solid ${state.accent};border-radius:${state.radius}px;box-shadow:0 6px ${state.glow}px ${rgba(state.accent, 0.35)};opacity:${dis ? 0.45 : 1};transition:all 180ms ease;`;

    if (state.kind === 'button') {
      mount.innerHTML = `<button type="button" ${dis ? 'disabled' : ''} style="${boxStyle}padding:9px 16px;font-family:inherit;font-size:11.5px;font-weight:800;cursor:pointer;">${load ? 'Loading...' : state.label}</button>`;
    } else if (state.kind === 'badge') {
      mount.innerHTML = `<span style="${boxStyle}display:inline-flex;align-items:center;gap:7px;padding:6px 13px;font-size:11px;font-weight:700;"><span style="width:7px;height:7px;border-radius:50%;background:${state.accent};box-shadow:0 0 8px ${state.accent};"></span>${load ? 'Updating...' : 'Active Status'}</span>`;
    } else {
      mount.innerHTML = `<div style="${boxStyle}padding:11px 14px;width:100%;max-width:290px;"><div style="font-size:11.5px;font-weight:800;">Feature Card</div><div style="font-size:10px;opacity:0.8;margin-top:3px;">${load ? 'Loading content...' : state.sub}</div></div>`;
    }

    const out = document.getElementById('f-code-out');
    if (state.exportTab === 'css') {
      out.value = `@theme {\n  --color-page-bg: ${state.canvas};\n  --color-card-bg: ${state.bg};\n  --color-text: ${state.fg};\n  --color-accent: ${state.accent};\n  --radius-card: ${state.radius}px;\n  --shadow-glow: 0 10px ${state.glow}px ${rgba(state.accent, 0.28)};\n}`;
    } else if (state.exportTab === 'prompt') {
      out.value = `Apply this theme in React 19 + Tailwind CSS v4:\n- Page Background: ${state.canvas} | Card Background: ${state.bg} | Text Color: ${state.fg} (${cr.toFixed(1)}:1 WCAG ${tier})\n- Accent Color: ${state.accent} | Corner Rounding: ${state.radius}px | Shadow & Glow: ${state.glow}px`;
    } else {
      out.value = `<div style={{ background: '${state.bg}', color: '${state.fg}', borderColor: '${state.accent}', borderRadius: '${state.radius}px', boxShadow: '0 8px ${state.glow}px ${rgba(state.accent, 0.28)}' }} className="border p-4 font-mono text-xs font-bold">\n  ${state.label}\n</div>`;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  function engageLiveUpdate(partial) {
    state = { ...state, ...partial, applyToPage: true };
    render();
  }

  triggerBtn.onclick = () => {
    drawer.classList.toggle('open');
    render();
  };
  document.getElementById('f-close-btn').onclick = () => {
    drawer.classList.remove('open');
  };
  document.getElementById('f-reset-page-btn').onclick = () => {
    state = { ...DEFAULTS, applyToPage: false };
    render();
  };

  drawer.querySelectorAll('#f-presets button').forEach(b => {
    b.onclick = () => {
      const key = b.dataset.preset;
      const p = PRESETS[key];
      if (p) {
        engageLiveUpdate({
          preset: key,
          accent: p.accent,
          accent2: p.accent2,
          canvas: p.canvas,
          bg: p.bg,
          fg: p.fg,
          muted: p.muted,
        });
      }
    };
  });

  drawer.querySelectorAll('[data-accent-swatch]').forEach(b => {
    b.onclick = () => {
      engageLiveUpdate({ accent: b.dataset.accentSwatch, preset: 'custom' });
    };
  });

  drawer.querySelectorAll('[data-surf-idx]').forEach(b => {
    b.onclick = () => {
      const s = SURFACE_SWATCHES[+b.dataset.surfIdx];
      if (s) {
        engageLiveUpdate({ canvas: s.canvas, bg: s.bg, fg: s.fg, preset: 'custom' });
      }
    };
  });

  document.getElementById('f-accent').oninput = e => engageLiveUpdate({ accent: e.target.value, preset: 'custom' });
  document.getElementById('f-canvas').oninput = e => engageLiveUpdate({ canvas: e.target.value, preset: 'custom' });
  document.getElementById('f-bg').oninput = e => engageLiveUpdate({ bg: e.target.value, preset: 'custom' });
  document.getElementById('f-fg').oninput = e => engageLiveUpdate({ fg: e.target.value, preset: 'custom' });
  document.getElementById('f-rad').oninput = e => engageLiveUpdate({ radius: +e.target.value });
  document.getElementById('f-glow').oninput = e => engageLiveUpdate({ glow: +e.target.value });
  document.getElementById('f-bdr').oninput = e => engageLiveUpdate({ borderAlpha: +e.target.value });
  document.getElementById('f-kind').onchange = e => { state.kind = e.target.value; render(); };
  document.getElementById('f-state').onchange = e => { state.state = e.target.value; render(); };
  document.getElementById('f-live-page-toggle').onclick = () => { state.applyToPage = !state.applyToPage; render(); };

  drawer.querySelectorAll('[data-exp]').forEach(b => {
    b.onclick = () => { state.exportTab = b.dataset.exp; render(); };
  });

  document.getElementById('f-copy-btn').onclick = () => {
    const val = document.getElementById('f-code-out').value;
    navigator.clipboard?.writeText(val).catch(() => {});
    const btn = document.getElementById('f-copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy Code'; }, 1200);
  };

  render();
})();
