# Frontend Modernization & Security Refactor Plan

## Why

The frontend currently reports **93 npm advisories** (18 critical, 27 high, 30 moderate,
18 low). Roughly 80% of them live in the **build/dev tooling** (Storybook 6.5 + the
hand-rolled Webpack/Babel chain), not in the runtime app code. Only `pdfjs-dist` and
`react-router-dom` are runtime-facing.

Rather than patch 93 transitive advisories under a fragile custom Webpack + Storybook 6 +
Yarn PnP setup, we replace the toolchain with **Vite + Vitest**. This deletes most of the
vulnerable dependencies at once and leaves a stack that stays current with a plain
`npm update`.

### Decisions made

| Decision | Choice |
|---|---|
| Build tooling | Migrate to **Vite + Vitest** |
| Storybook | **Drop it for now** (can re-add Storybook 8 + Vite builder later) |
| React | Upgrade **17 → 18** (React 19 as a later, separate step) |
| Package manager | Consolidate on **npm** (remove Yarn PnP) |

### Vulnerability sources (from `npm audit`)

| Source | Severity | Action |
|---|---|---|
| Storybook 6.5 (webpack4/5 builders) | high ×3 + others | Removed in Phase 4 |
| `babel-preset-es2015` | **critical** | Deleted (obsolete; `@babel/preset-env` replaces it) |
| `pdfjs-dist` 3.x | high (CVE: JS exec in malicious PDF) | Bumped in Phase 4 |
| `webpack-dev-server` | moderate | Removed with Webpack (Phase 1) |
| `react-router-dom` | moderate | Bumped in Phase 4 |
| `jest` 27 | low | Replaced by Vitest (Phase 3) |

---

## Current state (as-is)

- **44 JS/JSX files** — React 17 app: views, components, Redux Toolkit, MUI 5, react-router 6.
- Hand-rolled **Webpack 5 + Babel** (`webpack.dev.js`, `webpack.prod.js`, `.babelrc`).
- **Storybook 6.5** (`*.stories.js` files throughout `src/`).
- **Mixed package managers**: Yarn 3 PnP (`.pnp.cjs`, `yarn.lock`, `.yarnrc.yml`) *and* a
  stray `package-lock.json`.
- Env vars injected via `dotenv-webpack` as `process.env.*`.

### Code touch points (small — ~4 spots total)

- `process.env.*` usages → `import.meta.env.VITE_*`:
  - `src/index.js:12` — `GOOGLE_ANALYTICS_TRACKING_ID`
  - `src/services/sumMyTextService.js:4` — `SUM_MY_TEXT_SERVICE`
- JSX in `.js` files → rename to `.jsx` (esbuild only treats `.jsx` as JSX):
  - `src/index.js`
  - `src/hoc/withTitle/WithTitle.js`
- `src/index.js` — `ReactDOM.render(...)` → `createRoot` from `react-dom/client` (React 18).

---

## Phased plan

Each phase is independently verifiable — stop and commit after any one. Do **one phase per
commit** so review and rollback are easy.

### Phase 0 — Consolidate the package manager (foundation)

Remove the Yarn PnP / npm ambiguity that makes updates fragile. Standardize on **npm**.

- Delete: `.pnp.cjs`, `.pnp.loader.mjs`, `.yarn/`, `.yarnrc.yml`, `yarn.lock`.
- Keep: `package-lock.json`.
- Update the 4 CI workflows (`.github/workflows/frontend_*.yml`) to use `npm ci` /
  `npm run build`.
- Remove `"packageManager": "yarn@3.1.0"` from `package.json`.

**Verify:** clean `npm install` with no PnP artifacts remaining.

### Phase 1 — Introduce Vite, remove Webpack/Babel

- Add `vite` + `@vitejs/plugin-react`; create `vite.config.js`.
- Move `public/index.html` → root `index.html` with
  `<script type="module" src="/src/index.jsx">`.
- Rename JSX-in-`.js` files → `.jsx`: `src/index.js`, `src/hoc/withTitle/WithTitle.js`.
- Env vars: Vite exposes only `VITE_`-prefixed vars via `import.meta.env`.
  - `src/index.js:12` → `import.meta.env.VITE_GOOGLE_ANALYTICS_TRACKING_ID`
  - `src/services/sumMyTextService.js:4` → `import.meta.env.VITE_SUM_MY_TEXT_SERVICE`
  - Rename keys in `.env.example` / `.env` with the `VITE_` prefix.
- `pdfjs-dist` worker: switch to Vite-native worker import (`?url` / `import.meta.url`).
- Delete `webpack.dev.js`, `webpack.prod.js`, `.babelrc`, and the babel/webpack/loader
  devDeps: `babel-loader`, `eslint-loader`, `file-loader`, `babel-preset-es2015`,
  `dotenv-webpack`, `webpack`, `webpack-cli`, `webpack-dev-server`, `html-webpack-plugin`,
  `eslint-webpack-plugin`, `@babel/*`.
- Update `package.json` scripts: `dev` → `vite`, `build` → `vite build`,
  `preview` → `vite preview`.

**Verify:** `npm run dev` serves the app; `npm run build` produces build output; PDF
upload + speech-to-text + API call all work.

### Phase 2 — React 17 → 18

- Bump `react` / `react-dom` to 18.
- In `src/index.jsx`, replace `ReactDOM.render(...)` (from `react-dom`) with `createRoot`
  from `react-dom/client`.
- MUI 5, Redux Toolkit 1.9, react-router 6, react-redux 8 are all React-18-compatible — no
  other forced changes.

**Verify:** app renders, no console errors.

### Phase 3 — Jest → Vitest

- Replace `jest` with `vitest` + `jsdom`.
- Bump `@testing-library/react` 12 → 16 (React 18 compatible).
- Configure Vitest globals + `import.meta.env` mocking; `test` script → `vitest`.

**Verify:** `npm test` green.

### Phase 4 — Remove Storybook + patch stragglers

- Remove all `@storybook/*` devDeps, `@mdx-js/react`, `@storybook/testing-library`,
  `eslint-plugin-storybook`, and the `storybook` / `build-storybook` scripts.
- `*.stories.js` files: leave in tree (harmless, no longer built) or delete — TBD.
- Bump runtime-facing deps: **`pdfjs-dist`** (high-severity CVE), **`react-router-dom`**.
- ESLint now runs standalone (not via `eslint-loader`); optionally migrate to flat config
  later.

**Verify:** `npm audit` near-zero; `npm run lint` clean.

### Phase 5 — Lock in "easy to update"

- Add Dependabot or Renovate config so future bumps arrive as small PRs.
- Optionally add `npm audit --audit-level=high` as a CI gate in the frontend workflows.

---

## Expected outcome

- Entire Webpack / Babel / Storybook attack surface removed.
- Only 2 runtime deps needed real version bumps (`pdfjs-dist`, `react-router-dom`).
- `src/` React code changes in ~4 spots total (2 env vars, 2 file renames, 1 `createRoot`).
- Future updates: a plain `npm update` plus small automated PRs.
