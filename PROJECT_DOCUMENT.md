# Periodic Table Revision — Project Document

---

## Product Title

**Periodic Table Revision**

*Periodic table only — explore, study, quiz the 118 elements*

**Scope:** This product covers ONLY the periodic table. It does NOT cover chemical reactions, equations, formulas, organic chemistry, stoichiometry, bonding, or other chemistry topics.

---

## 1. Problem Statement

### The Real Problem

Students preparing for chemistry exams face several challenges when revising the periodic table:

| Problem | Impact |
|---------|--------|
| **Information overload** | 118 elements with multiple properties (symbol, name, atomic number, mass, group, period, electron configuration) — overwhelming to memorize |
| **No targeted practice** | Students waste time reviewing elements they already know instead of focusing on weak areas |
| **Passive learning** | Static flashcards and printed tables don't engage or test recall effectively |
| **Poor retention** | Without active recall (quizzes, self-testing), students forget quickly |
| **Scattered tools** | Separate apps for table view, quiz, and comparison — no single revision hub |

### Why This Matters for the Learning Community

- **High school & college students** need quick, focused revision before exams
- **Self-learners** studying chemistry lack accessible, free tools
- **Teachers** can recommend a simple, no-login tool for homework
- **Contribution value**: Open, vanilla JS project — others can extend, learn from, or adapt it

---

## 2. Solution

### What We Built

**Periodic Table Revision** is a single-page web application that combines:

1. **Interactive periodic table** — Click any element to see details
2. **Smart search & filters** — Find elements by name, symbol, number; filter by period or weak elements
3. **Study mode** — Hide properties and test recall; reveal when stuck
4. **Weak element tracking** — Mark elements you need practice; filter to study only those
5. **Quiz mode** — Multiple-choice questions (atomic number, symbol, mass)
6. **Element comparison** — Compare two elements side-by-side
7. **Progress tracking** — Visual progress bar for elements needing practice
8. **Continue learning** — Resume from last viewed element

### Why It Will Work

| Factor | Explanation |
|--------|--------------|
| **Active recall** | Study mode + quiz force retrieval, which improves long-term memory |
| **Spaced repetition** | Weak element tracking encourages revisiting difficult elements |
| **Single focus** | One tool for explore → study → quiz → compare |
| **No friction** | No sign-up, no backend — works offline, instant load |
| **Proven stack** | HTML, CSS, vanilla JS — stable, fast, easy to maintain |

---

## 3. How We Are Going to Solve It

### 3.1 Development Approach

- **UI is already built** — We can move directly into development and refinement
- **Covers all topics learned** — DOM, events, localStorage, CSS Grid, forms, validation
- **Easy and quick to build** — No backend, no database, no APIs — pure frontend

### 3.2 Data Model (Conceptual ER / Structure)

Since this is a **frontend-only** app with no database, we use:

- **In-memory data**: `ELEMENTS` array (118 objects)
- **Persistent data**: `localStorage` for user-specific state

```
┌─────────────────────────────────────────────────────────────────┐
│                     ELEMENTS (Static Data)                        │
├─────────────────────────────────────────────────────────────────┤
│ symbol (PK) │ name │ atomicNumber │ atomicMass │ group │ period  │
│ electronConfiguration │ xpos │ ypos                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ referenced by
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  USER STATE (localStorage)                       │
├─────────────────────────────────────────────────────────────────┤
│ Profile          │ { name, email }                               │
│ Weak Elements   │ { "Fe": "weak", "Au": "weak", ... }            │
│ Last Viewed     │ "Fe" (symbol)                                  │
│ Study Hidden    │ { atomicNumber: true, atomicMass: false, ... }  │
│ Welcome Seen    │ "true"                                         │
└─────────────────────────────────────────────────────────────────┘
```

**Relationship**: User state references elements by `symbol` (e.g., weak elements, last viewed, compare selection).

### 3.3 User Flow Diagram

```
                    ┌──────────────────┐
                    │   First Visit?   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ Yes                          │ No
              ▼                              ▼
    ┌─────────────────┐            ┌─────────────────┐
    │ Profile Modal   │            │ Periodic Table  │
    │ (Name + Email)  │            │ Revision        │
    └────────┬────────┘            └────────┬────────┘
             │                               │
             ▼                               │
    ┌─────────────────┐                      │
    │ Welcome Modal   │                      │
    │ (Tips)          │                      │
    └────────┬────────┘                      │
             │                               │
             └───────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │      Main Interface          │
              │  • Periodic Table (grid)     │
              │  • Search bar                │
              │  • Filters (All / Weak)      │
              │  • Period checkboxes         │
              └──────────────┬───────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Click Element   │ │ Search Input    │ │ Filter/Period    │
│                 │ │                 │ │                  │
│ → Detail Panel  │ │ → Highlight     │ │ → Re-render      │
│ → Mark Weak     │ │   matching      │ │   filtered table │
│ → Compare       │ │   elements      │ │                  │
└────────┬────────┘ └─────────────────┘ └─────────────────┘
         │
         ├─────────────────────────────────────────────┐
         │                                             │
         ▼                                             ▼
┌─────────────────┐                          ┌─────────────────┐
│ Study Mode      │                          │ Quiz Mode        │
│ • Hide props    │                          │ • MC questions   │
│ • Reveal Answer │                          │ • Score tracking  │
│ • Mark weak     │                          │ • End quiz       │
└─────────────────┘                          └─────────────────┘
         │                                             │
         └──────────────────┬──────────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ localStorage Update │
                 │ (weak, lastViewed)  │
                 └─────────────────────┘
```

### 3.4 Features & Key Highlights

| # | Feature | Description | Tech Used |
|---|---------|-------------|-----------|
| 1 | **Periodic Table Grid** | Full 118 elements, IUPAC colors by category (alkali, halogen, etc.), proper layout with lanthanides/actinides | CSS Grid, DOM creation |
| 2 | **Element Detail Panel** | Click element → show symbol, name, atomic number, mass, group, period, electron config | Event listeners, template literals |
| 3 | **Search** | By name, symbol, or atomic number; highlights matches, hides non-matches | `input` event, `filter()` |
| 4 | **Study Mode** | Hide atomic number, mass, electron config, or group; test recall; "Reveal Answer" shows all | Checkboxes, conditional rendering |
| 5 | **Weak Element Tracking** | Mark elements as "needs practice"; filter table to show only weak elements | localStorage, state object |
| 6 | **Filter by Period** | Checkboxes for periods 1–7; show only selected periods | `filter()`, re-render |
| 7 | **Progress Bar** | Count of weak elements; visual progress indicator | DOM update, CSS |
| 8 | **Element Comparison** | Select 2 elements → side-by-side table (atomic number, mass, group, period, electron config) | State, table generation |
| 9 | **Quiz Mode** | Random MC: "Which element has atomic number X?", "Symbol for Y?", "Atomic mass of Z?" | `Math.random()`, event handling |
| 10 | **Profile & Welcome** | First-time: name + email; welcome tips modal | Form validation, localStorage |
| 11 | **Continue Learning** | Banner: "Continue learning [Element]?" → quick resume | localStorage (lastViewed) |
| 12 | **Color Legend** | Hover/focus on "?" to see element type colors | CSS, accessibility |

### 3.5 Topics Covered (Learning Outcomes)

| Topic | Where Used |
|-------|------------|
| **HTML** | Semantic structure, forms, modals, labels, ARIA |
| **CSS** | Grid, Flexbox, variables, media queries, responsive design |
| **JavaScript** | DOM manipulation, events, localStorage, state, arrays, objects |
| **Form Validation** | Profile form (name length, email format) |
| **Accessibility** | ARIA, keyboard navigation, labels |

---

## 4. Project Structure

```
Periodic Table Revision/
├── index.html          # Main HTML structure
├── styles.css          # All styling (Grid, Flexbox, responsive)
├── elements-data.js    # ELEMENTS array (118 elements)
├── app.js              # Main application logic
├── README.md           # Setup & run instructions
├── TEAM_GUIDE.md       # Task division for 5–6 members
└── PROJECT_DOCUMENT.md # This document
```

---

## 5. Summary

| Aspect | Summary |
|--------|---------|
| **Product** | **Periodic Table Revision** — web app for periodic table only |
| **Problem** | Students struggle to revise 118 elements effectively; no single tool for explore + study + quiz |
| **Solution** | **Periodic Table Revision** — interactive, focused, periodic table only, no backend |
| **Why it works** | Active recall, weak-element focus, zero friction, proven tech |
| **Build status** | UI complete; ready for development and feature polish |
| **Contribution** | Useful for students, teachers, self-learners; open vanilla JS for learning |
