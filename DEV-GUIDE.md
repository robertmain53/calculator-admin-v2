# 🧠 Calculator Admin System — Developer Guide

Welcome to the `calculator-admin-v2` system — the AI-enhanced backend toolchain for building, reviewing, improving, and publishing world-class calculators into the `calchub` site.

---

## 🚀 Setup Instructions

```bash
cd calculator-admin-v2
npm install
node server-v2.js
```

The API will run on: `http://localhost:3001`

---

## 🗂 Folder Structure Overview

- `content/` — Raw markdown calculators (`.md`)
- `components/` — Raw Vue calculator components (`.vue`)
- `content-improved/` — AI-enhanced markdown output
- `components-improved/` — AI-enhanced Vue output
- `approved/` — Final content ready for publishing
- `logs/` — Structured logs per calculator
- `api/` — Modular route handlers for all endpoints
- `__tests__/` — Jest-based endpoint tests

---

## 🔧 API Endpoints

### `POST /review`
Validates markdown frontmatter, lints markdown + Vue, checks SEO and A11y.

```json
{
  "slug": "bmi-calculator",
  "lang": "en"
}
```

### `POST /improve`
Enhances `.md` and `.vue` via AI (mocked now), stores in `*-improved/`.

### `POST /approve`
Copies improved files to `approved/` folders, ready for publish.

### `POST /publish`
Deploys files to `calchub/` and triggers build.

### `POST /rollback`
Restores last approved version from `approved/` into `calchub/`.

### `GET /logs/:slug`
Returns all logs for a calculator as structured JSON.

---

## 🧱 Creating a New Calculator (Flow)

1. **Generate Idea** (via prompt or manual calcbundle):
   - Output: `calcbundle/{slug}-calcbundle.json`

2. **Run Generator**:
   ```bash
   node generate-calc.js {slug}
   ```

3. **Run Review**:
   - `POST /review`

4. **Improve with AI**:
   - `POST /improve`

5. **Approve Files**:
   - `POST /approve`

6. **Publish to Site**:
   - `POST /publish`

---

## ✅ Running Tests

```bash
npm test
```

All API endpoints are tested using Jest and Supertest. Add new tests in `__tests__/`.

---

## 🧠 Next Steps

- Connect real AI prompts to `improve.js`
- Use Lighthouse CI in `review.js` for UX/SEO scoring
- Integrate versioning using Git snapshots
- Automate deploys with GitHub Actions

---

> For help or roadmap updates, refer to `STRATEGIA.md` in the root folder.