# Architecture Overview

React 19 single-page application for managing MBARI's VARS (Video Annotation and Reference
System) knowledge base: taxonomic concept editing, media, realizations, references,
templates, users, and change-history approval workflows.

Verified against the working tree on 2026-11-06 (branch `load-media`, HEAD `e13ee345`).
For a module-by-module navigation map see `docs/CODEBASE_INDEX.md`.

## Technology stack (from `package.json`)

- React `^19.2.8` + `react-dom`, `react-router-dom ^7.18.1`
- Vite `8.1.5` (`@vitejs/plugin-react 6.0.4`), Vitest `4.1.10` + jsdom + Testing Library
- MUI: `@mui/material ^9.2.0`, `@mui/x-data-grid ^9.10.1`, `@mui/x-tree-view ^9.10.1`,
  Emotion 11
- Supporting libs: `jwt-decode`, `lz-string` (preference compression), `swiper` (media
  carousel), `framer-motion`, `react-icons`, `puid-js` (id generation),
  `react-error-boundary`
- No Redux/Zustand and no HTTP library: state is React Context + hooks, transport is
  `fetch` wrapped in `src/lib/services/request.js`
- Tooling: Yarn 4.5.1 (node-modules linker), Node `22.22.1` (`.tool-versions`),
  ESLint 10 flat config, Prettier 3

## Backend services

The app is a pure frontend over three HTTP services, discovered at runtime:

- **oni** — the KB service: concepts, taxonomy/phylogeny, media, realizations, references,
  templates, history, users, preferences. Reads use a per-service JWT; attributed
  mutations use an oni *user* token (see `src/lib/services/oni/methods.js`).
- **annosaurus** — annotation service: annotations, associations, observations
  (`src/lib/services/annosaurus/methods.js`).
- **raziel** — auth/token exchange service (`src/lib/services/raziel/methods.js`).

`ConfigProvider` fetches `<config-url>/endpoints` at startup (`getEndpoints`,
`src/lib/services/config/getEndpoints.js`), builds a service lookup
(`createServiceLookup`), and creates a token manager
(`src/lib/services/auth/serviceTokens.js`). Everything downstream talks to services
through the `apiFns` helpers exposed on `ConfigContext`.

## Runtime entry and gating

`index.html` → `src/main.jsx` → `src/components/App.jsx`, which composes:

```
ThemeProvider(kbTheme) + CssBaseline
└─ Router basename='/kbeditor/'
   └─ Whoops (react-error-boundary, src/components/Whoops.jsx)
      └─ ConfigProvider
         └─ UserProvider
            └─ Routes: AuthRoute (layout route) → /kb → KBContainer; * → Navigate to /kb
```

`AuthRoute` (`src/components/auth/AuthRoute.jsx:11`) renders the KB only when
`user && config?.valid`; otherwise it renders the startup flow
(`src/components/startup/`: `ConfigForm` → read-only or full `LoginForm`).

## Provider stack (KBContainer)

`src/components/kb/KBContainer.jsx:70-88` composes, in dependency order:

```
AppModalProvider
└─ RefreshContext (value built inline; refresh() flushes prefs, remounts subtree via key)
   └─ TaxonomyProvider key={refreshKey}
      └─ PreferencesProvider
         └─ SelectedProvider
            └─ UsersProvider
               └─ PanelDataProvider
                  └─ ConceptModalProvider
                     └─ ConceptProvider
                        └─ KnowledgeBase
```

`KnowledgeBase` mounts the shared `PanelModalProvider`
(`src/contexts/panel/modal/factory.js`, since the 2026-10-31 "DRY edit modals" rework),
the `NavBar`, the `Panels` area, and modal/loading overlays. Panel-level providers
(`HistoryProvider`, `RealizationsProvider`, `ReferencesProvider`, `TemplatesProvider`)
mount inside their own panels; `UsersProvider` is mounted both globally and inside the
Users panel.

## Source layering

| Layer | Location | Rule of thumb |
|---|---|---|
| UI | `src/components/` | Rendering only; consumes contexts, never fetches directly |
| State | `src/contexts/` | Providers + contexts; orchestrate hooks, caches, editing state |
| Core logic | `src/lib/` | Framework-agnostic: `services/` (transport), `api/` (per-domain wrappers), `model/` (domain shaping), `concept/` (editing state machine + pending workflow), `constants/`, `auth/`, `local/` (storage), `hooks/`, `validators/`, `config/` (CONFIG registry), plus `theme.js`, `utils.js`, `csv*.js`, `errors.js` |
| UI strings | `src/config/**.json` | Labels/tooltips/alert text, consumed as `CONFIG.*` via `src/lib/config/` — do not hardcode UI strings in components |

## Panel system

Nine panels are registered as dynamic-import chunk loaders in
`src/components/kb/panels/modules.js` (Concepts, Templates, Realizations, References,
Embargoes, History, Notes, Users, AboutHelp). `Panel.jsx` loads chunks through an
explicit `LazyPanel` with a module-level cache — deliberately not `React.lazy`/`Suspense`,
whose fallback can stick inside the keep-alive hidden panels. Panels mount lazily on first
activation and are then kept mounted but hidden (`display:none` etc., `Panel.jsx:54-73`),
preserving per-panel UI state across switches while keeping panel code out of the startup
chunk.

Five table panels (History, Realizations, References, Templates, Users) are composed from
`usePanelFactory` + `PanelDataGrid` (MUI DataGrid wrapper) with per-panel
`use*Columns.jsx`, `*Pagination.jsx`, and `use*Export.js` CSV hooks. The Concepts panel is
the deep one: taxonomy tree sidebar (`ConceptsTree`, MUI `RichTreeView` with custom item
slots) + concept detail/editing view. Notes and Embargoes are `EmptyPanel` placeholders.

## State management model

- Exactly one reducer in the app: `conceptStateReducer`
  (`src/contexts/panels/concepts/staged/edit/conceptStateReducer.js`), the staged concept
  editing state machine. Everything else is `useState`/`useRef` + extracted hooks.
- High-frequency state is split into dedicated contexts so keystrokes don't re-render the
  tree: `ConceptStagedContext` (inline in `ConceptProvider`), `SelectedSettingsContext`
  (inline in `SelectedProvider`), `ConceptModalDataContext`/`ConceptModalProcessingContext`
  (inline in `ConceptModalProvider`).
- Taxonomy is a normalized graph (`{conceptMap, aliasMap, names, ranks, rootName}`) built
  and mutated in `src/lib/model/taxonomy.js`; all inserts go through the `insertConcept`
  choke point; tree items use structural-sharing caches in `buildTree`.
- API results follow `{payload}` / `{error, status}`; contexts unwrap them via
  `ConfigContext.apiFns` (`apiPayload`, `apiPaginated`, `apiResult`, `apiRaw`), never raw
  `fetch`.

## Modal architecture (three tiers)

1. **App level** — `AppModalProvider` + `src/components/modal/AppModal.jsx` (errors,
   logout confirm, export complete, app info).
2. **Concept panel** — hand-rolled `ConceptModalProvider` + `ConceptModal.jsx`; three
   contexts (ops stabilized via refs so modal activity never re-renders triggers, plus
   Data and Processing contexts).
3. **Other panels** — factory `src/contexts/common/createPanelModalProvider.jsx` (one
   provider emitting Data + Operations contexts). One shared instance lives in
   `src/contexts/panel/modal/` (mounted in `KnowledgeBase.jsx:36`, used by History);
   per-panel instances (`src/contexts/panels/{users,templates,references,realizations}/modal.js`)
   mount inside each panel provider. All render through the shared
   `src/components/modal/PanelModal.jsx` / `ModalShell.jsx`.

## Error handling philosophy

Errors surface to the `Whoops` error boundary or the AppModal error display rather than
being swallowed locally. Project policy (see `AGENTS.md`) is *no defensive programming*:
handle errors only where there is a real recovery path.
