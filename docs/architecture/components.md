# Component Inventory

Component and module responsibilities, verified 2026-11-06. This is an inventory with
responsibilities — for "where does file X live" navigation use `docs/CODEBASE_INDEX.md`.

## Shell components (`src/components/`)

| Component | Responsibility |
|---|---|
| `App.jsx` | MUI theme (`kbTheme` from `src/lib/theme.js`) + `CssBaseline`, router basename `/kbeditor/`, provider roots (`ConfigProvider`, `UserProvider`), routes |
| `Whoops.jsx` | `react-error-boundary` boundary; app-level crash UI |
| `auth/AuthRoute.jsx` | Gate: renders `<Outlet/>` only when `user && config?.valid`, else `<StartUp/>` |
| `startup/` (`StartUp`, `ConfigForm`, `LoginForm`, `ReadOnlyLogin`) | Config-URL entry, then login UI; `LoginForm` uses React `useActionState` |
| `kb/KBContainer.jsx` | Composes the KB provider stack; builds `RefreshContext` value (flush prefs → remount via key); initializes app preferences from `ConfigContext` |
| `kb/KnowledgeBase.jsx` | Mounts shared `PanelModalProvider`, `NavBar`, `Panels`, modal/loading overlays |
| `kb/Panels.jsx` + `Panel.jsx` + `panels/modules.js` | Panel registry (9 dynamic-import loaders), lazy mount-on-first-activation, keep-alive hidden panels, `LazyPanel` chunk cache |
| `kb/nav/` (`NavBar`, `UserActions`, `appInfo/`) | Panel links (Users hidden for non-admin), user actions, editable app preferences (`mediaBaseURL`, `phylogenyRoot`, `dsgConceptUrl`) |
| `kb/browserBack/` | popstate → logout-confirm modal |

## Concepts panel (`src/components/kb/panels/concepts/`)

The deepest UI tree. Major areas:

- **Sidebar** — `ConceptSelect`, `ConceptsTree` (MUI `RichTreeView` with custom
  `ConceptTreeItem`/`ConceptTreeLabel` slots), draggable divider. Tree behavior hooks in
  `sidebar/tree/lib/`: `useConceptClick` (disclosure expand/collapse semantics),
  `useExpandConcept` (self / collapse-pruning / Alt-click expand-all-descendants),
  `useConceptAutoExpand`, `useConceptsTreeScroll` (bounded-poll smooth scroll to current
  concept), `useArrowKeys`/`useArrowNavigation`.
- **Detail view** — `concept/detail/`: name/author/rank/aliases/media (with `swiper`
  carousel)/realizations/references/templates, plus a generic paginated `properties/`
  framework.
- **Editing UI** — `concept/change/staged/*` per-field staged editors; `change/pending/*`
  read-only approval mirror of the same fields; `staged/modal/StagedActions.jsx` drives
  save/reset with confirm-discard flow.

## Table panels (`src/components/kb/panels/`)

History, Realizations, References, Templates, Users. All compose
`src/components/common/panel/usePanelFactory` + `PanelDataGrid` (MUI DataGrid wrapper).
Per-panel conventions:

- `use*Columns.jsx` — column defs (incl. pending-row gating with `StampIcon` approve/reject
  entry points)
- `*Pagination.jsx` — paging controls (server-paginated for approved history,
  client-paginated elsewhere)
- `use*Export.js` — CSV export via `src/lib/csvExport.js` (File System Access API)
- `form/` + `*ModalUtils.jsx` — create/edit forms and modal plumbing
- `*ModalRenderer` — factory-generated modal mount (see Modal framework below)

Notes and Embargoes render `EmptyPanel` placeholders only.

## Common components (`src/components/common/`)

- `concept/` picker family: `ConceptSelect`, `ToConceptSelect`, `ConceptExtent`,
  `RelatedDataCounts`
- `panel/` layout framework: `usePanelFactory`, `PanelDataGrid`, `EmptyPanel`, page footers
- `tooltip/`: `KBTooltip`, `KBTooltipTarget`, `KBTooltipFormControlLabel` (see
  `docs/development/coding-conventions.md` for usage rules)
- `factory/` modal primitives
- `VersionDisplay.jsx` — version string + tooltip (dev-mode HMR refresh)

## Modal framework (`src/components/modal/`)

Three tiers (detail in `docs/architecture/overview.md`):

- `AppModal.jsx` — app-level (errors, logout confirm, export complete, app info)
- `ConceptModal.jsx` — concept-panel staged/pending editing modals
- `PanelModal.jsx` + `ModalShell.jsx` — shared shell for all factory-generated panel
  modals (since the 2026-10-31 "DRY edit modals" rework)
- `KbLoading.jsx`, shared `actions/` alerts

## Contexts and providers (`src/contexts/`)

Full inventory, with mount points:

| Context | Defined in | Provided by / mount point |
|---|---|---|
| `ConfigContext` | `config/ConfigContext.jsx` | `ConfigProvider` — `App.jsx` |
| `UserContext` | `user/UserContext.jsx` | `UserProvider` — `App.jsx` |
| `AppModalContext` | `app/AppModalContext.jsx` | `AppModalProvider` — `KBContainer.jsx:70` |
| `RefreshContext` | `refresh/RefreshContext.jsx` | inline value — `KBContainer.jsx:71` |
| `TaxonomyContext` | `taxonomy/TaxonomyContext.jsx` | `TaxonomyProvider` — `KBContainer.jsx:72` |
| `PreferencesContext` | `preferences/PreferencesContext.jsx` | `PreferencesProvider` — `KBContainer.jsx:73` |
| `SelectedContext`, `SelectedSettingsContext` | `selected/*.jsx` | `SelectedProvider` — `KBContainer.jsx:74` |
| `UsersContext` | `panels/users/UsersContext.jsx` | `UsersProvider` — global `KBContainer.jsx:75` + panel `Users.jsx` |
| `PanelDataContext` | `panel/data/PanelDataContext.jsx` | `PanelDataProvider` — `KBContainer.jsx:76` |
| `ConceptModalContext` / `…DataContext` / `…ProcessingContext` | `panels/concepts/modal/*.jsx` | `ConceptModalProvider` — `KBContainer.jsx:77` |
| `ConceptContext`, `ConceptStagedContext` | `panels/concepts/*.jsx` | `ConceptProvider` — `KBContainer.jsx:78` |
| `HistoryContext` | `panels/history/HistoryContext.jsx` | `HistoryProvider` — `panels/History.jsx` |
| `ReferencesContext` | `panels/references/ReferencesContext.jsx` | `ReferencesProvider` — `panels/References.jsx` |
| `RealizationsContext` | `panels/realizations/RealizationsContext.jsx` | `RealizationsProvider` — `panels/Realizations.jsx` |
| `TemplatesContext` | `panels/templates/TemplatesContext.jsx` | `TemplatesProvider` — `panels/Templates.jsx` |
| `PanelModal{Data,Operations}Context` (shared) | generated, `panel/modal/factory.js` | `PanelModalProvider` — `KnowledgeBase.jsx:36` |
| `{Users,Templates,References,Realizations}Modal{Data,Operations}Context` | generated, `panels/<name>/modal.js` | inside each panel provider |

Provider responsibilities:

- **`ConfigProvider`** — endpoint discovery (`getEndpoints`), service lookup
  (`oni`/`annosaurus`/`raziel`), service-token manager, app preferences, and the `apiFns`
  unwrap helpers every context uses.
- **`UserProvider`** — session lifecycle, token refresh (1h expiry window,
  `user/lib/tokenIsExpiring.js`), unsaved-changes guard (`guardedAction`),
  `savePreferencesRef` flush slot. Internals in `user/lib/` (`useProcessAuth`,
  `useRefreshUser`, `useLogout`, `useInvalidAuth`, `useAuthUser`).
- **`TaxonomyProvider`** — normalized taxonomy graph, lazy hydration loaders,
  integrity checks (`useTaxonomyIntegrity`), `conceptEditsRefresh` post-edit
  reconciliation, incremental media-icon fill (`fillConceptMedia`).
- **`PreferencesProvider`** — server prefs bridge: `useInitPrefs` (normalize stored
  history), `usePrefsTimer` (15s autosave of dirty keys), `useSavePrefs` (flush).
- **`SelectedProvider`** — current concept/panel over history stacks
  (`lib/local/state/historyState`), per-panel filter settings; provides both
  `SelectedContext` and `SelectedSettingsContext` inline.
- **`PanelDataProvider`** — central caches: references, realizations (per-concept,
  on-demand), templates, pending history, `explicitConcepts`; `refreshData(type)`.
- **`ConceptProvider`** — the editing state machine: `concept` + immutable `initialState`
  + `stagedState` reducer; `staged/edit/` (reducer, `useModifyConcept` reset-confirm
  flow), `staged/save/` (`useSaveStaged`, 8 `submitter/*`, 5 `applier/*`,
  `applyRenameSideEffects`), `pending/` (`useConceptPending`, `useConceptUpdatePending`,
  `approve/*` + `reject/*` pure mutators). Provides `ConceptContext` +
  `ConceptStagedContext` inline.
- **`ConceptModalProvider`** — hand-rolled; ops context stabilized via
  `onCloseRef`/`modalDataRef`/`processingRef` (identity never changes after mount).

## Core library (`src/lib/`)

| Module | Responsibility |
|---|---|
| `services/request.js` | Curried `request(service, method, tokenType)`; attaches service token (reads) or oni user token (attributed mutations); exactly one retry with refreshed token on 401 |
| `services/{oni,annosaurus,raziel}/methods.js` | Per-service verb bindings (`oniGet/Post/Put/Delete` + `oniUserDelete/Post/Put`, …) |
| `services/auth/` | `login.js` (`loginUser`, `loginReadOnly`), `serviceTokens.js` (`createServiceTokenManager`: JWT exchange with APIKEY, 30s expiry buffer, in-flight dedup, read-only short-circuit) |
| `services/config/` | `getEndpoints`, `createServiceLookup`, `localDevUrl.js`, `validateConfigUrl.js` |
| `api/` | 13 thin per-domain wrappers (concept, taxonomy, aliases, media, realizations, templates, references, history, annotations, associations, observations, users, preferences); result convention `{payload}` / `{error, status}` |
| `model/taxonomy.js` | Normalized taxonomy state, `insertConcept` choke point, `buildTree` with structural-sharing caches, lazy loaders (`loadTaxonomyConcept*`, phylogeny-based descendants) — largest file in the app (~660 lines) |
| `model/` (rest) | Domain shaping: `concept.js`, `aliases.js`, `media.js`, `realization.js`, `templates.js`, `reference.js`, `rank.js`, `history.js`, `children.js`, `preferences.js` (LZ-String serialization, 255-char limit) |
| `concept/state/` | Staged-editing state machine: one pure module per editable field (name, author, parent, rank, aliases, children, media, realizations, templates, value) with the `initialState`/`isModified`/`stateUpdates` contract; `state.js` aggregator; `staged.js` display helpers |
| `concept/pending/` | `processPendingApproval` orchestration, `applyApproves.js` (exports `applyApprovals`), `applyRejects.js`, `cloneStale.js` |
| `constants/` | `ACTION`, `CONCEPT`, `CONCEPT_STATE`, `HISTORY_FIELD`, `PENDING`, `MEDIA`, `ROLES`, `SELECTED`, `PREFS`, `PANEL_DATA`, `GUARDED_ACTION`, `RESETTING`, `LOADING`, `EXPORT_TYPE`; `ALIAS` and `ERROR_TEXT` are imported by path (not re-exported from `index.js`) |
| `auth/` | `decodeToken`, `processToken`, `refreshKey.js` (WebCrypto AES), `role.js` (`isAdmin`/`isReadOnly`) |
| `local/` | `store/localStore.js` factory, `authStore`, `configUrl`, `clearStores`; `state/historyState.js` navigation stacks |
| `hooks/` | `useDebounce`, `useDebouncedField`, `useProcessError`, `useLoadConceptError`, `useTaxonomyIntegrity`, `useProcessingManager`, `useSetProcessing`, `usePageGo`, `useFilterTooltip`, `useVersionTooltip`, `useKBData`, `useReRenderTrigger` |
| `validators/` | `isValidUrl`, `isValidMedia` (async load-probe) |
| `config/` | `CONFIG` registry over `src/config/**.json` |
| top-level | `csv.js`/`csvExport.js` (File System Access API), `errors.js` (structured error factories), `theme.js` (MBARI palette, MUI overrides), `utils.js` (`pick`, `drop`, `isDeepEqual`, `sleep`, `withTimeout`, `binSearch`, …) |

## Config (`src/config/`)

Pure JSON UI strings and user-tunable constants, consumed via `CONFIG.*`
(`src/lib/config/`). Per-panel dirs (`concepts/`, `history/`, `references/`,
`templates/`, `users/`, each with `modals/`), root files (`appInfo`, `button`, `concept`,
`export`, `security`, `processing`, `startup`, `whoops`), and `constants/` for tunable
values (currently `pagination.json` → `CONFIG.CONSTANTS.PAGINATION`).
