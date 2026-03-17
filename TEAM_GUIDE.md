# Chemistry Exam Revision Table – Team Guide

## Architecture Overview

The project is split into clear modules so each team member can own a part while understanding the whole.

---

## Task Division (5–6 Members)

### Member 1: UI Layout & HTML
- **Files:** `index.html`
- **Responsibilities:** Structure, semantic HTML, accessibility (labels, ARIA)
- **Concepts:** Semantic elements, forms, modals, sections

### Member 2: Styling & Periodic Table Grid
- **Files:** `styles.css`
- **Responsibilities:** Layout, colors, responsive design, periodic table grid
- **Concepts:** CSS Grid, Flexbox, media queries, variables

### Member 3: Element Data & Table Rendering
- **Files:** `elements-data.js`, `app.js` (renderPeriodicTable, handleElementClick, renderDetailPanel)
- **Responsibilities:** Element dataset, dynamic table rendering, detail panel
- **Concepts:** Arrays, objects, loops, DOM creation, template literals

### Member 4: Search & Study Mode
- **Files:** `app.js` (setupSearch, setupStudyMode)
- **Responsibilities:** Search by name/symbol/number, study mode with hide/reveal
- **Concepts:** Event listeners, input handling, conditional rendering

### Member 5: Weak Elements & Quiz
- **Files:** `app.js` (setupRevealAndWeak, setupPracticeWeak, setupQuiz)
- **Responsibilities:** Weak element tracking, practice filter, quiz logic
- **Concepts:** localStorage, state management, random selection

### Member 6: Progress, Comparison & UX
- **Files:** `app.js` (updateProgressUI, setupComparison, setupWelcomeModal, setupContinueBanner)
- **Responsibilities:** Progress bar, element comparison, welcome modal, continue banner
- **Concepts:** localStorage, DOM updates, modals

---

## Code Sections in app.js

| Section | Lines (approx) | Purpose |
|--------|----------------|---------|
| State & localStorage | Top | Load/save state |
| renderPeriodicTable | ~50 | Build grid from ELEMENTS |
| handleElementClick, renderDetailPanel | ~60 | Element selection & detail |
| setupSearch | ~25 | Search input handling |
| setupStudyMode | ~45 | Study mode toggles |
| setupRevealAndWeak, setupPracticeWeak | ~30 | Weak element logic |
| setupQuiz | ~70 | Quiz questions & scoring |
| updateProgressUI | ~5 | Progress bar |
| setupComparison | ~40 | Compare two elements |
| setupWelcomeModal, setupContinueBanner | ~35 | First-time & continue UX |

---

## Concepts Demonstrated

- **DOM manipulation:** Creating elements, updating content, toggling classes
- **Event handling:** click, input, change, keydown
- **State management:** `state` object, `state.weakElements`, `state.studiedElements`
- **localStorage:** getItem, setItem, JSON parse/stringify
- **Input validation:** Search maxlength, required checks
- **Responsive design:** Media queries in CSS

---

## Git Workflow

1. Create a branch for your feature: `git checkout -b feature/search`
2. Commit often: `git add .` then `git commit -m "Add search by symbol"`
3. Push and create PR, or merge after review
4. Avoid editing the same lines as teammates; communicate before changing shared code

---

## Mentor Review Tips

- Every member should be able to explain the full flow: click element → detail panel → study/quiz
- Know where your code lives and what it does
- Be ready to explain: localStorage usage, event flow, how the grid is built
