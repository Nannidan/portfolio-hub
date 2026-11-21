// ==UserScript==
// @name         Google Developer Badge & Pathway Auto-Completer
// @namespace    https://github.com/Nannidan
// @version      1.2.0
// @description  Floating HUD + auto-fast-forward for click-through Google Developer pathways, codelabs, and badge claim buttons
// @match        https://developers.google.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  let autoRun = true

  // Floating HUD indicator so you can see it working on mobile
  const hud = document.createElement('div')
  hud.style.cssText =
    'position:fixed;bottom:14px;left:14px;z-index:999999;background:#0f172a;color:#38bdf8;border:1px solid #0ea5e9;border-radius:10px;padding:8px 12px;font:600 12px/1.4 monospace;box-shadow:0 8px 24px rgba(0,0,0,0.45);display:flex;align-items:center;gap:8px;'
  hud.innerHTML =
    '<span id="gd-status">⚡ Auto-Badge: ON</span><button id="gd-next" style="background:#0ea5e9;color:#082f49;border:0;border-radius:6px;padding:3px 8px;font:700 11px monospace;cursor:pointer;">Pathways</button>'
  document.body.appendChild(hud)

  hud.querySelector('#gd-status')?.addEventListener('click', () => {
    autoRun = !autoRun
    const st = hud.querySelector('#gd-status')
    if (st) st.textContent = autoRun ? '⚡ Auto-Badge: ON' : '⏸ Auto-Badge: PAUSED'
  })

  hud.querySelector('#gd-next')?.addEventListener('click', () => {
    window.location.href = 'https://developers.google.com/learn/pathways'
  })

  function stepPathwayAndCodelab() {
    if (!autoRun) return

    // 1. If inside a <google-codelab>, jump straight to the final step and click Done
    const codelab = document.querySelector('google-codelab')
    if (codelab) {
      const steps = codelab.querySelectorAll('google-codelab-step')
      if (steps.length > 0 && window.location.hash !== `#${steps.length - 1}`) {
        window.location.hash = `#${steps.length - 1}`
      }
    }

    // 2. Click Done / Claim Badge / Next / Continue / Skip buttons
    const candidates = Array.from(
      document.querySelectorAll(
        '#done, a#done, button, a.button, a.devsite-button, devsite-button button',
      ),
    )

    for (const el of candidates) {
      if (!(el instanceof HTMLElement)) continue
      if (el.dataset.gdClicked === '1') continue
      const label = (el.textContent || el.getAttribute('aria-label') || '').trim()
      if (/^(done|complete|claim badge|unlock badge|next|continue|next activity)$/i.test(label)) {
        el.dataset.gdClicked = '1'
        const st = hud.querySelector('#gd-status')
        if (st) st.textContent = `⚡ Clicked: ${label}`
        el.click()
        break
      }
    }
  }

  window.setInterval(stepPathwayAndCodelab, 1200)
})()
