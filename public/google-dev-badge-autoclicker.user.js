// ==UserScript==
// @name         Google Developer Badge & Pathway Auto-Completer
// @namespace    https://github.com/Nannidan
// @version      3.0.0
// @description  Auto-jumps to pathway quizzes, solves <devsite-quiz> questions automatically, and steps through codelabs to earn Google Developer Badges
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

  const STORAGE_KEY = 'gd_autobadge_v3_on'
  const QUEUE_IDX_KEY = 'gd_autobadge_v3_qidx'
  let autoRun = window.localStorage.getItem(STORAGE_KEY) !== '0'

  // Curated queue of verified free Google Developer Quizzes & Pathways that award profile badges
  const BADGE_QUEUE = [
    'https://developer.android.com/courses/quizzes/android-ai-overview',
    'https://developer.android.com/courses/quizzes/passkeys',
    'https://developer.android.com/courses/quizzes/kotlin-multiplatform',
    'https://developer.android.com/courses/pathways/android-basics-compose-unit-1-pathway-1',
    'https://developer.android.com/courses/pathways/android-basics-compose-unit-1-pathway-2',
    'https://developer.android.com/courses/pathways/android-basics-compose-unit-1-pathway-3',
    'https://developer.android.com/courses/pathways/android-basics-compose-unit-2-pathway-1',
    'https://developer.android.com/courses/pathways/android-basics-compose-unit-2-pathway-2',
    'https://developer.android.com/courses/pathways/android-basics-compose-unit-2-pathway-3',
    'https://developer.android.com/courses/pathways/android-architecture',
    'https://developer.android.com/courses/pathways/make-your-android-app-accessible',
    'https://developer.android.com/courses/pathways/improve-user-experience',
    'https://developers.google.com/learn/pathways',
  ]

  // Track per-question option index attempts
  const questionChoiceMap = new Map()
  let quizRound = 0

  // Persistent Floating HUD
  const hud = document.createElement('div')
  hud.id = 'gd-autobadge-hud'
  hud.style.cssText =
    'position:fixed;bottom:14px;left:14px;z-index:2147483647;background:#0f172a;color:#38bdf8;border:2px solid #0ea5e9;border-radius:12px;padding:8px 12px;font:700 12px/1.4 monospace;box-shadow:0 12px 32px rgba(0,0,0,0.75);display:flex;align-items:center;gap:8px;flex-wrap:wrap;max-width:94vw;'
  hud.innerHTML = `
    <span id="gd-status" style="cursor:pointer;">${autoRun ? '⚡ v3.0 Quiz Solver: ON' : '⏸ PAUSED'}</span>
    <button id="gd-solve-btn" style="background:#10b981;color:#022c22;border:0;border-radius:6px;padding:4px 9px;font:700 11px monospace;cursor:pointer;">Solve / Jump ▸</button>
    <button id="gd-next-badge" style="background:#f59e0b;color:#1e1b4b;border:0;border-radius:6px;padding:4px 9px;font:700 11px monospace;cursor:pointer;">Next Badge ⏭</button>
  `
  document.documentElement.appendChild(hud)

  const statusEl = hud.querySelector('#gd-status')
  const setStatus = (msg) => {
    if (statusEl) statusEl.textContent = msg
  }

  statusEl?.addEventListener('click', () => {
    autoRun = !autoRun
    window.localStorage.setItem(STORAGE_KEY, autoRun ? '1' : '0')
    setStatus(autoRun ? '⚡ v3.0 Quiz Solver: ON' : '⏸ PAUSED')
  })

  hud.querySelector('#gd-solve-btn')?.addEventListener('click', () => {
    tick(true)
  })

  function goToNextBadgeInQueue() {
    const idx = Number.parseInt(window.localStorage.getItem(QUEUE_IDX_KEY) || '0', 10) || 0
    const nextUrl = BADGE_QUEUE[idx % BADGE_QUEUE.length]
    window.localStorage.setItem(QUEUE_IDX_KEY, String((idx + 1) % BADGE_QUEUE.length))
    setStatus(`⚡ Loading Badge #${(idx % BADGE_QUEUE.length) + 1}...`)
    window.location.href = nextUrl
  }

  hud.querySelector('#gd-next-badge')?.addEventListener('click', goToNextBadgeInQueue)

  // Determine whether a graded <li class="devsite-quiz-question"> is already answered correctly
  function isQuestionCorrect(questionEl) {
    if (
      questionEl.classList.contains('correct') ||
      questionEl.classList.contains('is-correct') ||
      questionEl.getAttribute('data-correct') === 'true'
    ) {
      return true
    }
    const answers = Array.from(questionEl.querySelectorAll('.devsite-quiz-answer'))
    for (const ans of answers) {
      const inp = ans.querySelector('input')
      if (!inp || !inp.checked) continue
      if (
        (ans.classList.contains('correct') || ans.classList.contains('is-correct')) &&
        !ans.classList.contains('incorrect') &&
        !ans.classList.contains('is-incorrect')
      ) {
        return true
      }
      const fb = (ans.querySelector('.devsite-quiz-feedback')?.textContent || '').trim()
      if (
        fb.length > 0 &&
        /^(correct|that's right|that is correct|right|great job|well done|spot on|yes)/i.test(fb) &&
        !/not correct|incorrect|try again|wrong/i.test(fb)
      ) {
        return true
      }
    }
    return false
  }

  // Solve <devsite-quiz> questions automatically
  function solveDevsiteQuiz() {
    const quizEl = document.querySelector('devsite-quiz')
    if (!quizEl) return false

    // Check if quiz was already passed!
    const returnBtn = quizEl.querySelector('a.devsite-quiz-return-button:not([hidden])')
    const badgeAwarded = quizEl.querySelector('.static-badge-awarded-container')
    if (
      (returnBtn && returnBtn.offsetParent !== null) ||
      (badgeAwarded && badgeAwarded.children.length > 0) ||
      /congratulations|you earned|badge awarded|passed the quiz/i.test(quizEl.textContent || '')
    ) {
      setStatus('🏆 Badge Earned! Advancing...')
      window.setTimeout(goToNextBadgeInQueue, 1500)
      return true
    }

    const questions = Array.from(quizEl.querySelectorAll('li.devsite-quiz-question'))
    if (questions.length === 0) return false

    let unresolvedCount = 0

    questions.forEach((qEl, qIdx) => {
      if (isQuestionCorrect(qEl)) return

      unresolvedCount += 1
      const answers = Array.from(qEl.querySelectorAll('.devsite-quiz-answer'))
      if (answers.length === 0) return

      const qType = qEl.getAttribute('data-type') || ''
      const firstInput = answers[0]?.querySelector('input')
      const isCheckbox = firstInput?.type === 'checkbox' || qType.includes('multiple_answers')

      const prevAttempt = questionChoiceMap.has(qIdx) ? questionChoiceMap.get(qIdx) : -1
      const nextAttempt = prevAttempt + 1
      questionChoiceMap.set(qIdx, nextAttempt)

      if (isCheckbox) {
        // Cycle bitmask combinations 1..(2^N - 1)
        const maxMask = Math.max(1, (1 << answers.length) - 1)
        const mask = (nextAttempt % maxMask) + 1
        answers.forEach((ans, aIdx) => {
          const inp = ans.querySelector('input')
          const lbl = ans.querySelector('label')
          const shouldCheck = Boolean(mask & (1 << aIdx))
          if (inp && inp.checked !== shouldCheck) {
            if (lbl) lbl.click()
            else inp.click()
            inp.checked = shouldCheck
            inp.dispatchEvent(new Event('change', { bubbles: true }))
          }
        })
      } else {
        // Single-answer radio button: pick option (nextAttempt % answers.length)
        const pickIdx = nextAttempt % answers.length
        const targetAns = answers[pickIdx]
        const inp = targetAns?.querySelector('input')
        const lbl = targetAns?.querySelector('label')
        if (inp) {
          if (lbl) lbl.click()
          else inp.click()
          inp.checked = true
          inp.dispatchEvent(new Event('input', { bubbles: true }))
          inp.dispatchEvent(new Event('change', { bubbles: true }))
        }
      }
    })

    // Click the "Submit answers" button (.devsite-quiz-submit-button)
    const submitBtn =
      quizEl.querySelector('button.devsite-quiz-submit-button') ||
      quizEl.querySelector('form.devsite-quiz-body button[type="submit"]') ||
      Array.from(quizEl.querySelectorAll('button')).find((b) =>
        /submit/i.test(b.textContent || ''),
      )

    if (submitBtn instanceof HTMLElement) {
      quizRound += 1
      setStatus(`⚡ Quiz Pass #${quizRound} (${questions.length - unresolvedCount}/${questions.length})`)
      submitBtn.click()
      return true
    }

    return false
  }

  function tick(manual = false) {
    if (!autoRun && !manual) return

    // 1. If we are on a Quiz page (<devsite-quiz>), solve & submit it!
    if (document.querySelector('devsite-quiz')) {
      solveDevsiteQuiz()
      return
    }

    // 2. If we are on a Pathway page (<devsite-playlist>), jump straight to its Quiz (even if collapsed!)
    const playlist = document.querySelector('devsite-playlist')
    if (playlist) {
      const quizSection = playlist.querySelector('.devsite-playlist--section[type="quiz"]')
      const quizLink =
        playlist.querySelector('a[href*="/quizzes/"]') ||
        playlist.querySelector('a[data-category*="take the quiz"]')
      const quizUrl =
        quizLink?.getAttribute('href') || quizSection?.getAttribute('path') || null

      if (quizUrl) {
        setStatus('⚡ Jumping straight to Pathway Quiz...')
        window.location.href = quizUrl
        return
      }

      // If no quiz in this pathway, expand & open the first uncompleted codelab or article
      const codelabSection = playlist.querySelector('.devsite-playlist--section[type="codelab"]')
      const codelabUrl =
        codelabSection?.getAttribute('path') ||
        playlist.querySelector('a[href*="/codelabs/"]')?.getAttribute('href')
      if (codelabUrl) {
        setStatus('⚡ Opening Pathway Codelab...')
        window.location.href = codelabUrl
        return
      }
    }

    // 3. If we are inside a Google Codelab (<google-codelab>), step through to Done
    const codelab = document.querySelector('google-codelab')
    if (codelab) {
      const steps = codelab.querySelectorAll('google-codelab-step')
      const currentStep =
        Number.parseInt(window.location.hash.replace('#', '') || '0', 10) || 0

      if (steps.length > 0 && currentStep < steps.length - 1) {
        const nextBtn = document.querySelector('#next-step')
        if (nextBtn instanceof HTMLElement) nextBtn.click()
        window.location.hash = `#${currentStep + 1}`
        setStatus(`⚡ Codelab ${currentStep + 1}/${steps.length}`)
        return
      }

      const doneBtn = document.querySelector('#done')
      if (doneBtn instanceof HTMLElement) {
        setStatus('⚡ Codelab Complete!')
        doneBtn.click()
        return
      }
    }
  }

  window.setInterval(() => tick(false), 1600)
})()
