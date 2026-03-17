# Chemistry Exam Revision Table

A frontend-only web application that helps students quickly revise periodic table elements before chemistry exams through interactive learning and practice features.

## Tech Stack

- **HTML** – Structure and semantic markup
- **CSS** – Styling, Flexbox, CSS Grid, responsive design
- **Vanilla JavaScript** – DOM manipulation, event handling, localStorage

No frameworks, no backend, no databases, no external APIs.

## Project Structure

```
week 6 group project/
├── index.html        # Main HTML structure
├── styles.css        # All styling
├── elements-data.js  # Periodic table dataset (118 elements)
├── app.js            # Main application logic
├── README.md         # This file
└── TEAM_GUIDE.md     # Task division & architecture
```

## Features

- **Periodic Table Grid** – Full 118 elements with proper layout (including lanthanides & actinides)
- **Element Detail Panel** – Click any element to see name, symbol, atomic number, mass, group, period, electron configuration
- **Search** – By name, symbol, or atomic number
- **Study Mode** – Hide properties and test your memory; Reveal Answer marks weak elements
- **Weak Element Tracking** – Practice weak elements only (localStorage)
- **Continue Learning** – Resume from last viewed element
- **Progress Tracker** – Elements studied count with progress bar
- **Element Comparison** – Compare two elements side by side
- **Quiz Mode** – Multiple choice questions (atomic number, symbol, mass)
- **First-time Welcome** – One-time welcome message

## How to Run

1. Open `index.html` in a web browser, or
2. Use a local server (e.g. `npx serve .` or Live Server in VS Code)

## localStorage Keys

- `chemistryRevision_welcomeSeen` – First-time welcome dismissed
- `chemistryRevision_weakElements` – Elements marked as weak
- `chemistryRevision_lastViewed` – Last viewed element symbol
- `chemistryRevision_studied` – Set of studied element symbols
- `chemistryRevision_studyHidden` – Study mode hidden properties

## Team

5–6 members. See `TEAM_GUIDE.md` for task division and architecture.
