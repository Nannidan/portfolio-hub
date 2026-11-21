(() => {
  if (document.getElementById('forge-ui-universal-drawer')) return;

  const STORAGE_KEY = 'forge_ui_live_tokens_v4';
  const DEFAULTS = {
    preset: 'cyan',
    accent: '#38bdf8',
    accent2: '#6366f1',
    fg: '#eef7ff',
    bg: '#081326',
    radius: 12,
    glow: 20,
    kind: 'button',
    state: 'default',
    label: 'DEPLOY NODE // 09',
    sub: '99.98% Uptime · 14ms Edge Latency',
    exportTab: 'jsx',
    applyToPage: true,
  };

  let state = { ...DEFAULTS };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') state = { ...DEFAULTS, ...saved };
  } catch {}

  function hexToRgb(hex) {
    const h = (hex || '#38bdf8').replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function lum([r, g, b]) {
    const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function contrastRatio(h1, h2) {
    const l1 = lum(hexToRgb(h1)), l2 = lum(hexToRgb(h2));
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  // Remove any old static broken link from index.html
  document.querySelectorAll('a[href="/forge-studio.html"], a[href="./forge-studio.html"]').forEach(el => {
    if (el.textContent && el.textContent.includes('FORGE // UI')) el.remove();
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
      gap: 7px;
      padding: 9px 14px;
      border-radius: 999px;
      background: rgba(6, 12, 24, 0.94);
      color: var(--forge-live-accent, #38bdf8);
      border: 1.5px solid var(--forge-live-accent, #38bdf8);
      box-shadow: 0 0 18px rgba(56, 189, 248, 0.32);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: transform 150ms ease, box-shadow 150ms ease;
    }
    #forge-ui-universal-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 24px rgba(56, 189, 248, 0.52);
    }
    #forge-ui-universal-btn .f-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--forge-live-accent, #38bdf8);
      box-shadow: 0 0 8px var(--forge-live-accent, #38bdf8);
    }
    #forge-ui-universal-drawer {
      position: fixed;
      left: 14px;
      bottom: 56px;
      z-index: 9999;
      width: min(410px, calc(100vw - 28px));
      max-height: min(82vh, 690px);
      overflow-y: auto;
      background: rgba(8, 13, 25, 0.97);
      color: #eef7ff;
      border: 1.5px solid var(--forge-live-accent, #38bdf8);
      border-radius: 16px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.85), 0 0 28px rgba(56, 189, 248, 0.22);
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
    .f-title { font-size: 10px; font-weight: 700; color: var(--forge-live-accent, #38bdf8); text-transform: uppercase; letter-spacing: 0.6px; }
    .f-btn {
      font-family: inherit;
      font-size: 10.5px;
      color: #dbeafe;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 7px;
      padding: 5px 8px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: border-color 140ms ease, background 140ms ease;
    }
    .f-btn:hover { border-color: var(--forge-live-accent, #38bdf8); color: #ffffff; }
    .f-btn.active {
      border-color: var(--forge-live-accent, #38bdf8);
      color: var(--forge-live-accent, #38bdf8);
      background: rgba(56, 189, 248, 0.14);
      font-weight: 700;
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
      min-height: 112px;
      background: #030711;
      border: 1px dashed rgba(255, 255, 255, 0.18);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px;
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
      min-height: 92px;
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
  triggerBtn.innerHTML = `<span class="f-dot"></span><span>FORGE // UI STUDIO</span>`;

  const drawer = document.createElement('aside');
  drawer.id = 'forge-ui-universal-drawer';
  drawer.setAttribute('aria-label', 'Forge UI Studio Live Workbench');
  drawer.innerHTML = `
    <div class="f-row" style="border-bottom:1px solid rgba(255,255,255,0.12);padding-bottom:8px;">
      <div>
        <div style="font-size:12px;font-weight:800;color:#fff;">FORGE // <span style="color:var(--forge-live-accent,#38bdf8)">UI STUDIO</span></div>
        <div style="font-size:9.5px;color:#8ca2c0;">LIVE DESIGN-TOKEN &amp; WCAG 2.1 WORKBENCH</div>
      </div>
      <div class="f-row">
        <a href="./forge-studio.html" class="f-btn" title="Open Full-Screen Forge UI Studio">Full Studio &#8599;</a>
        <button type="button" class="f-btn" id="f-close-btn" aria-label="Close Forge UI Studio">&times;</button>
      </div>
    </div>

    <div>
      <div class="f-row" style="margin-bottom:5px;">
        <span class="f-title">Live Project Theme Presets</span>
        <span id="f-wcag-pill" class="f-wcag">15.8:1 AAA</span>
      </div>
      <div class="f-row" id="f-presets">
        <button type="button" class="f-btn" data-preset="cyan">Obsidian Cyan</button>
        <button type="button" class="f-btn" data-preset="emerald">Nordic Emerald</button>
        <button type="button" class="f-btn" data-preset="indigo">Executive Indigo</button>
        <button type="button" class="f-btn" data-preset="hc">High Contrast</button>
      </div>
    </div>

    <div class="f-row">
      <label style="font-size:10px;color:#8ca2c0;">Accent <input type="color" id="f-accent" style="vertical-align:middle;width:28px;height:22px;border:0;background:none;cursor:pointer;" /></label>
      <label style="font-size:10px;color:#8ca2c0;">Text <input type="color" id="f-fg" style="vertical-align:middle;width:28px;height:22px;border:0;background:none;cursor:pointer;" /></label>
      <label style="font-size:10px;color:#8ca2c0;">Surface <input type="color" id="f-bg" style="vertical-align:middle;width:28px;height:22px;border:0;background:none;cursor:pointer;" /></label>
      <button type="button" class="f-btn active" id="f-live-page-toggle" title="Apply tokens live to current page">Live Page: ON</button>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <label style="font-size:10px;color:#8ca2c0;">Radius: <span id="f-rad-val" style="color:#fff;">12px</span>
        <input type="range" id="f-rad" min="0" max="28" style="width:100%;accent-color:var(--forge-live-accent,#38bdf8);" />
      </label>
      <label style="font-size:10px;color:#8ca2c0;">Glow: <span id="f-glow-val" style="color:#fff;">20px</span>
        <input type="range" id="f-glow" min="0" max="42" style="width:100%;accent-color:var(--forge-live-accent,#38bdf8);" />
      </label>
    </div>

    <div class="f-row">
      <select id="f-kind" class="f-select" style="flex:1;">
        <option value="button">Action Button</option>
        <option value="card">Telemetry Card</option>
        <option value="badge">Status Pill</option>
      </select>
      <select id="f-state" class="f-select" style="flex:1;">
        <option value="default">State: Default</option>
        <option value="loading">State: Loading</option>
        <option value="disabled">State: Disabled</option>
      </select>
    </div>

    <div class="f-stage" id="f-stage-mount"></div>

    <div>
      <div class="f-row" style="margin-bottom:5px;">
        <div class="f-row">
          <button type="button" class="f-btn" data-exp="jsx">JSX</button>
          <button type="button" class="f-btn" data-exp="css">@theme CSS</button>
          <button type="button" class="f-btn" data-exp="prompt">AI Prompt</button>
        </div>
        <button type="button" class="f-btn active" id="f-copy-btn">Copy</button>
      </div>
      <textarea id="f-code-out" class="f-code" readonly spellcheck="false"></textarea>
    </div>
  `;

  document.body.appendChild(triggerBtn);
  document.body.appendChild(drawer);

  function render() {
    document.documentElement.style.setProperty('--forge-live-accent', state.accent);
    document.getElementById('f-accent').value = state.accent;
    document.getElementById('f-fg').value = state.fg;
    document.getElementById('f-bg').value = state.bg;
    document.getElementById('f-rad').value = state.radius;
    document.getElementById('f-glow').value = state.glow;
    document.getElementById('f-rad-val').textContent = state.radius + 'px';
    document.getElementById('f-glow-val').textContent = state.glow + 'px';
    document.getElementById('f-kind').value = state.kind;
    document.getElementById('f-state').value = state.state;

    const pageBtn = document.getElementById('f-live-page-toggle');
    pageBtn.textContent = state.applyToPage ? 'Live Page: ON' : 'Live Page: OFF';
    pageBtn.classList.toggle('active', !!state.applyToPage);

    if (state.applyToPage) {
      pageThemeStyle.textContent = `
        :root {
          --accent: ${state.accent} !important;
          --color-accent: ${state.accent} !important;
        }
      `;
    } else {
      pageThemeStyle.textContent = '';
    }

    drawer.querySelectorAll('#f-presets button').forEach(b => {
      b.classList.toggle('active', b.dataset.preset === state.preset);
    });
    drawer.querySelectorAll('[data-exp]').forEach(b => {
      b.classList.toggle('active', b.dataset.exp === state.exportTab);
    });

    const cr = contrastRatio(state.fg, state.bg);
    const tier = cr >= 7 ? 'AAA' : cr >= 4.5 ? 'AA' : 'LOW';
    const wcagEl = document.getElementById('f-wcag-pill');
    const col = cr >= 4.5 ? '#34d399' : '#fb7185';
    wcagEl.textContent = `${cr.toFixed(1)}:1 WCAG ${tier}`;
    wcagEl.style.color = col;
    wcagEl.style.borderColor = col;

    const mount = document.getElementById('f-stage-mount');
    const dis = state.state === 'disabled';
    const load = state.state === 'loading';
    const boxStyle = `background:${state.bg};color:${state.fg};border:1.5px solid ${state.accent};border-radius:${state.radius}px;box-shadow:0 6px ${state.glow}px ${state.accent}44;opacity:${dis ? 0.45 : 1};transition:all 180ms ease;`;

    if (state.kind === 'button') {
      mount.innerHTML = `<button type="button" ${dis ? 'disabled' : ''} style="${boxStyle}padding:9px 16px;font-family:inherit;font-size:11.5px;font-weight:800;cursor:pointer;">${load ? 'SYNCING TOKENS...' : state.label}</button>`;
    } else if (state.kind === 'badge') {
      mount.innerHTML = `<span style="${boxStyle}display:inline-flex;align-items:center;gap:7px;padding:6px 13px;font-size:11px;font-weight:700;"><span style="width:7px;height:7px;border-radius:50%;background:${state.accent};box-shadow:0 0 8px ${state.accent};"></span>${load ? 'PROBING...' : state.label}</span>`;
    } else {
      mount.innerHTML = `<div style="${boxStyle}padding:11px 14px;width:100%;max-width:280px;"><div style="font-size:11.5px;font-weight:800;">${state.label}</div><div style="font-size:10px;opacity:0.8;margin-top:3px;">${load ? 'Acquiring telemetry stream...' : state.sub}</div></div>`;
    }

    const out = document.getElementById('f-code-out');
    if (state.exportTab === 'css') {
      out.value = `@theme {\n  --color-accent: ${state.accent};\n  --color-surface: ${state.bg};\n  --color-ink: ${state.fg};\n  --radius-card: ${state.radius}px;\n  --shadow-glow: 0 8px ${state.glow}px ${state.accent}44;\n}`;
    } else if (state.exportTab === 'prompt') {
      out.value = `Build a ${state.kind.toUpperCase()} component in React 19 + Tailwind CSS v4:\n- Accent: ${state.accent} | Surface: ${state.bg} | Text: ${state.fg} (${cr.toFixed(1)}:1 WCAG ${tier})\n- Radius: ${state.radius}px | Glow: ${state.glow}px | State: ${state.state}`;
    } else {
      out.value = `<div style={{ background: '${state.bg}', color: '${state.fg}', borderColor: '${state.accent}', borderRadius: '${state.radius}px', boxShadow: '0 6px ${state.glow}px ${state.accent}44' }} className="border px-4 py-2.5 font-mono text-xs font-bold">\n  ${state.label}\n</div>`;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  triggerBtn.onclick = () => {
    drawer.classList.toggle('open');
    render();
  };
  document.getElementById('f-close-btn').onclick = () => {
    drawer.classList.remove('open');
  };

  drawer.querySelectorAll('#f-presets button').forEach(b => {
    b.onclick = () => {
      const p = b.dataset.preset;
      if (p === 'emerald') state = { ...state, preset: p, accent: '#10b981', fg: '#ecfdf5', bg: '#051510' };
      else if (p === 'indigo') state = { ...state, preset: p, accent: '#818cf8', fg: '#eef2ff', bg: '#0d0c22' };
      else if (p === 'hc') state = { ...state, preset: p, accent: '#ffffff', fg: '#ffffff', bg: '#000000', glow: 10 };
      else state = { ...state, preset: 'cyan', accent: '#38bdf8', fg: '#eef7ff', bg: '#081326' };
      render();
    };
  });

  document.getElementById('f-accent').oninput = e => { state.accent = e.target.value; state.preset = 'custom'; render(); };
  document.getElementById('f-fg').oninput = e => { state.fg = e.target.value; state.preset = 'custom'; render(); };
  document.getElementById('f-bg').oninput = e => { state.bg = e.target.value; state.preset = 'custom'; render(); };
  document.getElementById('f-rad').oninput = e => { state.radius = +e.target.value; render(); };
  document.getElementById('f-glow').oninput = e => { state.glow = +e.target.value; render(); };
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
    setTimeout(() => { btn.textContent = 'Copy'; }, 1200);
  };

  render();
})();
