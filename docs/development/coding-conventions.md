# Coding Conventions

Conventions observed in the source (sampled across `src/components`, `src/contexts`,
`src/lib`), verified 2026-11-06. Where a rule is enforced by tooling, the tool is named.

## Project policies (from `AGENTS.md`, confirmed in code)

- **No defensive programming — hard rule.** No guards, fallbacks, type-checks, or
  null-checks for conditions that should not occur; let errors surface at their source.
  Only handle an error where there is a real "what should happen next" answer. Errors
  route to the `Whoops` boundary or AppModal rather than being swallowed. A guard for an
  impossible state costs a future maintainer a wasted thought cycle ("when is this not
  an Array? what should happen then?"). When a value has exactly two real states (e.g.
  absent vs. Array), use the precise construct (`?.`) rather than a type check
  (`Array.isArray`) that implies states which cannot occur.
- **Minimal comments.** Verified: ~0.35 comment lines per source file. Comments appear
  only where behavior is non-obvious (e.g. the structural-sharing cache note in
  `src/lib/model/taxonomy.js:25-27`, the proxy warning in `vite.config.js:17-21`).
  Rationale belongs in docs and commit messages.

## Formatting

Enforced by Prettier only (`.prettierrc`) — **not** by ESLint, and there is no
`format` script; formatting is applied from the editor:

```json
{
  "arrowParens": "avoid",
  "jsxSingleQuote": true,
  "printWidth": 120,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

So: single quotes everywhere (including JSX attributes), no semicolons, `x => x` arrow
parens, 120-column width. Note: `@stylistic/eslint-plugin` is installed but **not** wired
into `eslint.config.js`.

## Lint rules that shape the code

`eslint.config.js` (flat config, `**/*.{js,jsx}`):

- react-hooks v7 compiler-powered rules as **errors**: `rules-of-hooks`,
  `static-components`, `immutability`, `set-state-in-effect`, `refs`,
  `preserve-manual-memoization`; `exhaustive-deps` is a warning.
  Practical effect: no setState directly in effects, no defining components inside
  components, respect memoization dependencies.
- `no-irregular-whitespace`, `unicode-bom: never`.
- `no-unused-vars` tuned with `^_` ignore patterns (`reportUsedIgnorePattern`).
- `react/prop-types` off (no TypeScript either — plain JSX with JSDoc rare).
- `react-refresh/only-export-components` warn (allows constant exports) — keep
  non-component exports out of component files where possible.

## Imports

- Path alias `@` → `./src` (`vite.config.js:41-44`, mirrored in `jsconfig.json`). Use
  `@/...` in components and contexts; deep `src/lib` files also use relative imports
  between siblings (e.g. `src/lib/services/request.js` imports `./params`, `./send`).
- Order observed: React → third-party (`@mui/*`, `react-icons`, `react-router-dom`) →
  `@/` absolute (components → contexts → lib).

## Components and files

- Arrow-function components assigned to a PascalCase `const`, `export default` at the
  bottom of the file (`App.jsx:17,41`).
- `memo` where re-render cost matters, with explicit `displayName`
  (`UserForm.jsx:11,185`).
- Naming: components PascalCase (`UserForm.jsx`), hooks camelCase `use*` with default
  export (`useUserColumns.jsx`), contexts PascalCase (`SelectedContext.jsx`), lib modules
  camelCase (`taxonomy.js`, `request.js`).
- Test files mirror src paths: `test/components/kb/panels/...` ↔
  `src/components/kb/panels/...`, named `*.test.jsx` (or `*.test.js` for pure logic),
  often with dotted domain names (`concept.object.name.test.jsx`).

## React 19 idioms

- Context consumed via `use(Context)`, not `useContext` (`UsersTableData.jsx:30`).
- Newer providers use the React 19 `<Context value={...}>` shorthand instead of
  `<Context.Provider>` (`KBContainer.jsx`, `ConceptProvider.jsx:383`,
  `AppModalProvider.jsx:76`; `SelectedProvider.jsx:89` still uses `.Provider` — both
  occur, match the file you're in).
- `useActionState` for form submission (`LoginForm`).

## State management

- Exactly one reducer (`conceptStateReducer`); everything else is `useState`/`useRef` +
  extracted hooks. Don't add a second reducer or an external store.
- Respect the context splits: consume keystroke-frequency keys from
  `ConceptStagedContext` (not `ConceptContext`) and filter-frequency keys from
  `SelectedSettingsContext` (not `SelectedContext`). See `docs/decisions/
  architecture-decisions.md` for why.
- API results follow `{payload}` / `{error, status}`; unwrap via `apiFns` from
  `ConfigContext`, never raw `fetch` outside `src/lib/services/`.

## UI strings and styling

- UI strings come from `src/config/**.json` via the `CONFIG` registry
  (`src/lib/config/`) — 206 usages across 140 files. Do not hardcode labels/tooltips/
  alert text in components. Known exceptions (debt, not precedent): `UserForm.jsx` form
  labels and `useUserColumns.jsx` `headerName`s are hardcoded.
- Styling is the MUI `sx` prop: inline objects or module-level SCREAMING_SNAKE constants
  (e.g. `USERS_SX`, `DATA_GRID_PROPS` in `UsersTableData.jsx:17-27`). No `styled()`, no
  CSS modules; `classnames` is a declared dependency with no observed usage.
- Static module-level constants in SCREAMING_SNAKE; destructure registry constants at
  module top (e.g. `const { CONCEPT, PANEL } = SELECTED`).

## Tooltips

- Wrap the actual interactive target with `KBTooltip`, not nested text.
- For potentially disabled targets, render a wrapper element (`span` /
  `Box component='span'`) inside `KBTooltip` so hover still fires.
- Prefer shared wrappers in `src/components/common/tooltip/` (`TooltipTarget`,
  `TooltipFormControlLabel`) over ad-hoc patterns.

## Panels and modals

- New table panels: compose `usePanelFactory` + `PanelDataGrid`; follow the
  `use*Columns.jsx` / `*Pagination.jsx` / `use*Export.js` conventions.
- New panels register in `src/components/kb/panels/modules.js` as a
  `load: () => import(...)` chunk loader — never `React.lazy`.
- Panel modals use the factory (`createPanelModalProvider`); the concept panel keeps its
  hand-rolled three-context provider. Don't hand-roll new modal contexts.

## Constants

- Developer constants governing internal structure/processing live in
  `src/lib/constants/`; user-tunable numeric/behavioral values live in
  `src/config/constants/*.json` wrapped by `src/lib/config/constants/` and exposed as
  `CONFIG.CONSTANTS.*` (precedent: `PAGINATION` moved there 2026-10-30).
- Temporary workarounds use the `Cx`-prefix convention (`CxTmp`, `CxTBD`, `CxInc`)
  instead of TODO/FIXME comments — there are deliberately zero TODO/FIXME markers in
  `src/`.
