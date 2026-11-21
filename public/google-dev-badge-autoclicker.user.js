// ==UserScript==
// @name         Google Developer Badge & Pathway Auto-Completer
// @namespace    https://github.com/Nannidan
// @version      2.1.0
// @description  Universal auto-completer for Google Developer Pathways, Android Courses, Codelabs, Quizzes, web.dev, Firebase, and AI Studio courses
// @match        https://developers.google.com/*
// @match        https://codelabs.developers.google.com/*
// @match        https://developer.android.com/*
// @match        https://*.android.com/*
// @match        https://ai.google.dev/*
// @match        https://firebase.google.com/*
// @match        https://web.dev/*
// @match        https://chrome.dev/*
// @match        https://cloud.google.com/*
// @match        https://www.cloudskillsboost.google/*
// @match        https://skills.google/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  const STORAGE_KEY = 'gd_autobadge_enabled'
  let autoRun = window.localStorage.getItem(STORAGE_KEY) !== '0'
  let quizAttemptIdx = 0

  // Create persistent floating HUD
  const hud = document.createElement('div')
  hud.id = 'gd-autobadge-hud'
  hud.style.cssText =
    'position:fixed;bottom:14px;left:14px;z-index:2147483647;background:#0f172a;color:#38bdf8;border:1.5px solid #0ea5e9;border-radius:10px;padding:8px 12px;font:600 12px/1.4 monospace;box-shadow:0 10px 28px rgba(0,0,0,0.6);display:flex;align-items:center;gap:8px;'
  hud.innerHTML = `
    <span id="gd-status" style="cursor:pointer;">${autoRun ? '⚡ Auto-Course: ON' : '⏸ Auto-Course: PAUSED'}</span>
    <button id="gd-skip-btn" style="background:#10b981;color:#022c22;border:0;border-radius:6px;padding:4px 8px;font:700 11px monospace;cursor:pointer;">Step ▸</button>
    <button id="gd-hub-btn" style="background:#0ea5e9;color:#082f49;border:0;border-radius:6px;padding:4px 8px;font:700 11px monospace;cursor:pointer;">Pathways</button>
  `
  document.documentElement.appendChild(hud)

  const statusEl = hud.querySelector('#gd-status')
  const setStatus = (msg) => {
    if (statusEl) statusEl.textContent = msg
  }

  statusEl?.addEventListener('click', () => {
    autoRun = !autoRun
    window.localStorage.setItem(STORAGE_KEY, autoRun ? '1' : '0')
    setStatus(autoRun ? '⚡ Auto-Course: ON' : '⏸ Auto-Course: PAUSED')
  })

  hud.querySelector('#gd-hub-btn')?.addEventListener('click', () => {
    window.location.href = 'https://developers.google.com/learn/pathways'
  })

  hud.querySelector('#gd-skip-btn')?.addEventListener('click', () => {
    runCourseStep(true)
  })

  // Deep querySelector across open Shadow DOMs
  function queryAllDeep(selector, root = document) {
    const results = Array.from(root.querySelectorAll(selector))
    const allNodes = root.querySelectorAll('*')
    for (const node of allNodes) {
      if (node.shadowRoot) {
        results.push(...queryAllDeep(selector, node.shadowRoot))
      }
    }
    return results
  }

  function isVisible(el) {
    if (!(el instanceof HTMLElement)) return false
    const rect = el.getBoundingClientRect()
    const style = window.getComputedStyle(el)
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0'
    )
  }

  function runCourseStep(manualTrigger = false) {
    if (!autoRun && !manualTrigger) return

    // 1. INSIDE A GOOGLE CODELAB (<google-codelab>)
    const codelab = document.querySelector('google-codelab')
    if (codelab) {
      const steps = codelab.querySelectorAll('google-codelab-step')
      const currentHash = window.location.hash.replace('#', '')
      const currentStep = Number.parseInt(currentHash || '0', 10) || 0

      if (steps.length > 0 && currentStep < steps.length - 1) {
        const nextBtn =
          document.querySelector('#next-step') ||
          queryAllDeep('#next-step')[0]
        if (nextBtn instanceof HTMLElement && isVisible(nextBtn)) {
          setStatus(`⚡ Codelab ${currentStep + 1}/${steps.length}`)
          nextBtn.click()
          return
        }
        window.location.hash = `#${currentStep + 1}`
        setStatus(`⚡ Codelab ${currentStep + 1}/${steps.length}`)
        return
      }

      const doneBtn =
        document.querySelector('#done') ||
        queryAllDeep('#done')[0]
      if (doneBtn instanceof HTMLElement && isVisible(doneBtn)) {
        setStatus('⚡ Codelab Done!')
        doneBtn.click()
        return
      }
    }

    // 2. INSIDE A COURSE QUIZ (devsite-quiz / multiple-choice questions)
    const quizInputs = queryAllDeep(
      'devsite-quiz input[type="radio"], devsite-quiz input[type="checkbox"], .devsite-quiz input[type="radio"], .devsite-quiz input[type="checkbox"], form input[type="radio"]',
    ).filter(isVisible)

    if (quizInputs.length > 0) {
      // Group radio inputs by name and select an option systematically
      const byGroup = new Map()
      for (const inp of quizInputs) {
        const key = inp.getAttribute('name') || 'default'
        if (!byGroup.has(key)) byGroup.set(key, [])
        byGroup.get(key).push(inp)
      }

      for (const [, group] of byGroup) {
        const pick = group[quizAttemptIdx % group.length]
        if (pick && !pick.checked) {
          pick.click()
        }
      }
      quizAttemptIdx += 1

      const submitBtn = queryAllDeep('button, input[type="submit"], a.button').find(
        (el) =>
          isVisible(el) &&
          /^(submit|check answers?|verify|claim badge|unlock badge|next|continue)$/i.test(
            (el.textContent || el.value || '').trim(),
          ),
      )
      if (submitBtn instanceof HTMLElement) {
        setStatus(`⚡ Quiz Attempt #${quizAttemptIdx}`)
        submitBtn.click()
        return
      }
    }

    // 3. INSIDE A PATHWAY / COURSE LESSON PAGE (Scroll + Next Activity / Start / Claim Badge)
    // Scroll down progressively so devsite registers article/video read completion
    if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 120) {
      window.scrollBy({ top: Math.round(window.innerHeight * 0.65), behavior: 'smooth' })
    }

    // Priority 1: Claim/Unlock Badge or Pathway Next Activity buttons
    const allButtons = queryAllDeep(
      'a.button, button, a[href*="/pathways/"], a[href*="/codelabs/"], .devsite-playlist-next a, devsite-playlist a',
    ).filter(isVisible)

    // Avoid clicking filter modal "Done" on the main /learn/pathways directory unless manual
    const isMainDirectory =
      window.location.pathname.replace(/\/$/, '') === '/learn/pathways' ||
      window.location.pathname.replace(/\/$/, '') === '/courses/pathways'

    for (const el of allButtons) {
      if (el.closest('#gd-autobadge-hud') || el.closest('devsite-header') || el.closest('devsite-footer-promos')) {
        continue
      }
      if (el.dataset.gdAutoClicked === '1' && !manualTrigger) continue

      const text = (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim()

      if (isMainDirectory) {
        if (/^start$/i.test(text)) {
          el.dataset.gdAutoClicked = '1'
          setStatus('⚡ Starting Pathway...')
          el.click()
          return
        }
        continue
      }

      if (
        /^(claim badge|unlock badge|get badge|next activity|nextstep|next|continue|take quiz|take the quiz|skip|complete|finish)$/i.test(
          text,
        )
      ) {
        el.dataset.gdAutoClicked = '1'
        setStatus(`⚡ Clicked: ${text}`)
        el.click()
        return
      }
    }

    // Priority 2: If on a Pathway overview page (/learn/pathways/<slug> or /courses/pathways/<slug>), click the first uncompleted activity or quiz
    if (
      (window.location.pathname.includes('/pathways/') ||
        window.location.pathname.includes('/courses/')) &&
      !isMainDirectory
    ) {
      const activityLinks = queryAllDeep(
        'a[href*="/codelabs/"], a[href*="quiz"], .devsite-playlist-item a, devsite-playlist a',
      ).filter(
        (el) =>
          isVisible(el) &&
          !el.closest('#gd-autobadge-hud') &&
          el.getAttribute('href') !== window.location.pathname,
      )

      const unvisited = activityLinks.find((el) => el.dataset.gdAutoClicked !== '1')
      if (unvisited instanceof HTMLElement) {
        unvisited.dataset.gdAutoClicked = '1'
        setStatus('⚡ Opening Course Step...')
        unvisited.click()
      }
    }
  }

  window.setInterval(() => runCourseStep(false), 1100)
})()
