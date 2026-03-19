# Team Workflow Guide — Periodic Prep

How to clone, work on, and push to the [periodic-prep](https://github.com/Mohamed-asmaan/periodic-prep) repository.

---

## 1. Clone the Repository

```bash
git clone https://github.com/Mohamed-asmaan/periodic-prep.git
cd periodic-prep
```

---

## 2. Switch to the `dev` Branch

All team work happens on the `dev` branch. After cloning:

```bash
git checkout dev
```

Or, if you want to create a local `dev` that tracks the remote:

```bash
git fetch origin
git checkout -b dev origin/dev
```

---

## 3. Daily Workflow

### Before you start working

```bash
git checkout dev
git pull origin dev
```

### Make your changes

Edit files as needed. The main project files are:

- `index.html` — structure and UI
- `styles.css` — styling
- `appFunc.js` — app logic
- `elements-data.js` — element data

> **Note:** `app.js` is in `.gitignore` and is not tracked. Do not commit it.

### Commit and push your work

```bash
git add .
git status          # Review what you're committing
git commit -m "Your descriptive commit message"
git push origin dev
```

---

## 4. Branch Overview

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. Only merge from `dev` after review. |
| `dev` | Development branch. All team members push here. |

---

## 5. Merging to `main`

When `dev` is ready for release:

1. Open a Pull Request: [Create PR: dev → main](https://github.com/Mohamed-asmaan/periodic-prep/compare/main...dev)
2. Review and approve
3. Merge into `main`

---

## 6. Quick Reference

| Task | Command |
|------|---------|
| Clone repo | `git clone https://github.com/Mohamed-asmaan/periodic-prep.git` |
| Switch to dev | `git checkout dev` |
| Get latest changes | `git pull origin dev` |
| Push your work | `git push origin dev` |
| Check current branch | `git branch` |
| See status | `git status` |

---

## 7. Troubleshooting

**"Your branch is behind 'origin/dev'"**  
Run: `git pull origin dev`

**Push rejected**  
Someone else pushed first. Run: `git pull origin dev` then `git push origin dev`

**Wrong branch**  
Run: `git checkout dev` before making changes
