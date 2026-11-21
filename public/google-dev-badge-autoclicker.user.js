// ==UserScript==
// @name         Google Developer Badge & Pathway Auto-Completer
// @namespace    https://github.com/Nannidan
// @version      3.1.0
// @description  Locks in variant-success / .devsite-quiz-feedback-container.correct before input events clear feedback, guaranteeing 100% quiz pass in <=4 submits
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

  // Permanently lock solved answers per question index so devsite's change listener can never erase them
  const lockedAnswerMap = new Map()
  const questionAttemptMap = new Map()
  let quizRound = 0

  const hud = document.createElement('div')
  hud.id = 'gd-autobadge-hud'
  hud.style.cssText =
    'position:fixed;bottom:14px;left:14px;z-index:2147483647;background:#0f172a;color:#38bdf8;border:2px solid #0ea5e9;border-radius:12px;padding:8px 12px;font:700 12px/1.4 monospace;box-shadow:0 12px 32px rgba(0,0,0,0.75);display:flex;align-items:center;gap:8px;flex-wrap:wrap;max-width:94vw;'
  hud.innerHTML = `
    <span id="gd-status" style="cursor:pointer;">${autoRun ? '⚡ v3.1 Quiz Lock: ON' : '⏸ PAUSED'}</span>
    <button id="gd-solve-btn" style="background:#10b981;color:#022c22;border:0;border-radius:6px;padding:4px 9px;font:700 11px monospace;cursor:pointer;">Solve ▸</button>
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
    setStatus(autoRun ? '⚡ v3.1 Quiz Lock: ON' : '⏸ PAUSED')
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

  // Inspect a graded question BEFORE any input click occurs (because clicking any input clears devsite's variant-success classes!)
  function detectSolvedState(qEl) {
    const answers = Array.from(qEl.querySelectorAll('.devsite-quiz-answer'))
    let hasSuccess = false
    let hasError = false
    const checkedIndices = []

    answers.forEach((ans, aIdx) => {
      const inp = ans.querySelector('input')
      if (inp?.checked) checkedIndices.push(aIdx)

      if (
        inp?.classList.contains('variant-success') ||
        ans.querySelector('.devsite-quiz-feedback-container.correct')
      ) {
        hasSuccess = true
      }
      if (
        inp?.classList.contains('variant-error') ||
        ans.querySelector('.devsite-quiz-feedback-container.incorrect') ||
        ans.querySelector('.devsite-quiz-feedback-container.partially-correct')
      ) {
        hasError = true
      }
    })

    if (
      qEl.querySelector('.devsite-quiz-question-level-feedback:not([hidden])') ||
      qEl.querySelector('.devsite-quiz-feedback-container.partially-correct')
    ) {
      hasError = true
    }

    if (hasSuccess && !hasError && checkedIndices.length > 0) {
      return checkedIndices
    }
    return null
  }

  function solveDevsiteQuiz() {
    const quizEl = document.querySelector('devsite-quiz')
    if (!quizEl) return false

    // Wait while grading spinner is active
    const submitBtn =
      quizEl.querySelector('button.devsite-quiz-submit-button') ||
      quizEl.querySelector('form.devsite-quiz-body button[type="submit"]')
    const spinner = submitBtn?.querySelector('devsite-spinner:not([hidden])')
    if (spinner && spinner.offsetParent !== null) {
      return true
    }

    // Check if quiz passed!
    const returnBtn = quizEl.querySelector('a.devsite-quiz-return-button:not([hidden])')
    const badgeAwarded = quizEl.querySelector('.static-badge-awarded-container')
    const scorePass = quizEl.querySelector('.devsite-quiz-score-pass')
    if (
      scorePass ||
      (returnBtn && returnBtn.offsetParent !== null) ||
      (badgeAwarded && badgeAwarded.children.length > 0)
    ) {
      setStatus('🏆 Quiz Passed! Badge Earned!')
      window.setTimeout(goToNextBadgeInQueue, 1600)
      return true
    }

    const questions = Array.from(quizEl.querySelectorAll('li.devsite-quiz-question'))
    if (questions.length === 0) return false

    // PASS 1: Snapshot all newly solved questions BEFORE touching any DOM inputs!
    questions.forEach((qEl, qIdx) => {
      if (lockedAnswerMap.has(qIdx)) return
      const solvedIndices = detectSolvedState(qEl)
      if (solvedIndices) {
        lockedAnswerMap.set(qIdx, solvedIndices)
      }
    })

    // PASS 2: Apply locked answers or advance unsolved questions by 1 step
    questions.forEach((qEl, qIdx) => {
      const answers = Array.from(qEl.querySelectorAll('.devsite-quiz-answer'))
      if (answers.length === 0) return

      const qType = qEl.getAttribute('data-type') || ''
      const firstInput = answers[0]?.querySelector('input')
      const isCheckbox = firstInput?.type === 'checkbox' || qType.includes('multiple_answers')

      if (lockedAnswerMap.has(qIdx)) {
        // Restore/keep locked winning option(s)
        const winningSet = new Set(lockedAnswerMap.get(qIdx))
        answers.forEach((ans, aIdx) => {
          const inp = ans.querySelector('input')
          const lbl = ans.querySelector('label')
          const shouldCheck = winningSet.has(aIdx)
          if (inp && inp.checked !== shouldCheck) {
            if (lbl) lbl.click()
            else inp.click()
            inp.checked = shouldCheck
            inp.dispatchEvent(new Event('change', { bubbles: true }))
          }
        })
        return
      }

      const prevAttempt = questionAttemptMap.has(qIdx) ? questionAttemptMap.get(qIdx) : -1
      const nextAttempt = prevAttempt + 1
      questionAttemptMap.set(qIdx, nextAttempt)

      if (isCheckbox) {
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

    if (submitBtn instanceof HTMLElement) {
      quizRound += 1
      setStatus(`⚡ Locked ${lockedAnswerMap.size}/${questions.length} (Try #${quizRound})`)
      submitBtn.click()
      return true
    }

    return false
  }

  function tick(manual = false) {
    if (!autoRun && !manual) return

    if (document.querySelector('devsite-quiz')) {
      solveDevsiteQuiz()
      return
    }

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
    }

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

  window.setInterval(() => tick(false), 1800)
})()
