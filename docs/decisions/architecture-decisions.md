# Architecture Decisions

Decisions embodied in the current codebase, reconstructed on 2026-11-06 from source,
`AGENTS.md`, and git history. This is a record of **existing** decisions, not proposals.
Each entry marks its evidence: **[documented]** = stated in AGENTS.md/code comments;
**[inferred]** = reconstructed from code structure and commit history.

## AD-1: React Context + hooks only; exactly one reducer

**[documented]** State management is plain React Context with `useState`/`useRef` +
extracted hooks. The single reducer, `conceptStateReducer`
(`src/contexts/panels/concepts/staged/edit/conceptStateReducer.js`), exists because
staged concept editing is a genuine multi-action state machine (per-field edits, resets
with confirm, initial-state snapshots). No Redux/Zustand/MobX, and no second reducer.
The reducer dispatches `CONCEPT_STATE` actions to pure per-field modules in
`src/lib/concept/state/` implementing the `initialState`/`isModified`/`stateUpdates`
contract, keeping the reducer itself a thin router.

## AD-2: Context splitting by update frequency

**[documented]** High-frequency state is isolated into dedicated contexts so keystrokes
don't re-render the tree/navbar:

- `ConceptContext` (low-frequency: concept, isEditing, initialState, pending) vs
  `ConceptStagedContext` (keystroke: `stagedState`, `modifyConcept`, `confirmReset`) —
  split 2026-09-06 (`87e9691e`).
- `SelectedContext` (selection) vs `SelectedSettingsContext` (filter settings) —
  `11140270`.
- `ConceptModalContext` ops vs `ConceptModalDataContext` vs
  `ConceptModalProcessingContext` — `b5ba2480`.

Consumers must take keys from the narrowest context that has them.

## AD-3: Inline providers for derived contexts

**[documented]** `ConceptStagedContext`, `SelectedSettingsContext`,
`ConceptModalDataContext`, `ConceptModalProcessingContext`, and `RefreshContext` have **no
dedicated provider files** — their values derive entirely from state their parent provider
owns and are provided inline. A separate provider would be a pass-through, and moving
staged state out of `ConceptProvider` would create a circular dependency
(`useModifyConcept` needs `initialState`; `ConceptProvider` effects need `stagedState`).
`createPanelModalProvider` is the inverse pattern: one provider emitting two contexts
(Data + Operations).

## AD-4: Keep-alive panels with a custom LazyPanel (no React.lazy/Suspense)

**[documented]** Panels mount lazily on first activation and are then hidden
(`display:none`), not unmounted (`src/components/kb/panels/Panel.jsx:54-73`). This
preserves per-panel UI state (filters, scroll, grid state) across switches and keeps panel
code out of the startup chunk. `React.lazy`/`Suspense` was deliberately rejected: a
Suspense boundary inside a hidden keep-alive panel can stick on its fallback when a panel
switch happens mid-load. `Panel.jsx` therefore loads chunks via explicit dynamic import
with a module-level `loadedPanels` cache (`LazyPanel`), throwing load errors to the error
boundary.

## AD-5: Three-tier modal architecture

**[documented/inferred]** App-level modals (`AppModalProvider`), concept-panel modals
(hand-rolled `ConceptModalProvider` with three contexts — ops stabilized via
`onCloseRef`/`modalDataRef`/`processingRef` so modal activity never re-renders triggers),
and factory-generated panel modals (`createPanelModalProvider`). Since commit `e05bf438`
(2026-10-31, "DRY edit modals") the panel tier has one shared instance
(`src/contexts/panel/modal/`, mounted in `KnowledgeBase.jsx`, used by History) plus
per-panel instances (`src/contexts/panels/{users,templates,references,realizations}/modal.js`)
mounted inside each panel provider, all rendering through shared
`PanelModal.jsx`/`ModalShell.jsx`. The concept tier stays hand-rolled because it needs
ref-stabilized ops and a processing overlay integrated with staged editing.

## AD-6: Normalized taxonomy model with a single insert choke point

**[inferred]** Taxonomy is stored normalized (`{conceptMap, aliasMap, names, ranks,
rootName}`) rather than as a nested tree; all inserts go through `insertConcept`
(`src/lib/model/taxonomy.js:508`), which normalizes media (`typeMediaItem`) and strips
`linkRealizations`. `buildTree`/`buildTreeItems` use structural-sharing node caches so
unchanged subtrees keep object identity across updates (memoized `RichTreeView` items).
This is what makes incremental hydration and post-edit reconciliation
(`conceptEditsRefresh`) cheap.

## AD-7: Phylogeny-based tree loading + asynchronous media fill

**[inferred]** Tree data loads lazily but with look-ahead: expanding a node loads
children **and grandchildren**; expand-all (Alt/Opt-click) uses a single
`phylogeny/down` call (`loadTaxonomyConceptDescendants`, `taxonomy.js:447`) instead of
per-concept fetches; concept path (for scroll-into-view) uses `phylogeny/up`
(`401be0df`, `36565370`). Structure commits immediately; per-concept media for tree icons
then fills in asynchronously in throttled batches (`fillConceptMedia`,
`loadConceptMediaIncremental`) via functional `setTaxonomy` updates, so mid-fill concept
switches/edits are never clobbered and media failures never reach the error boundary
(current work on branch `load-media`).

## AD-8: API layering and result convention

**[documented]** Four layers, one direction: `src/lib/api/*` (per-domain wrappers) →
`src/lib/services/<svc>/methods.js` (verb bindings) → `src/lib/services/request.js`
(token attach, exactly one 401 retry with refreshed token) → `fetch`. Results are always
`{payload}` / `{error, status}`; contexts unwrap through `ConfigContext.apiFns`. No HTTP
library (no axios — the README's claim is stale). Reads use per-service JWTs; attributed
mutations use the oni *user* token (`oniUser*` bindings) so the backend can attribute
changes to the logged-in user.

## AD-9: Service-token manager with read-only short-circuit

**[inferred]** `createServiceTokenManager` (`src/lib/services/auth/serviceTokens.js`)
exchanges per-service JWTs (`POST {url}/auth` with an APIKEY secret), validates with a
30-second expiry buffer, dedupes in-flight exchanges, and short-circuits all services to
a hardcoded read-only token (dummy JWT expiring 2222) for read-only sessions. The user's
password is stored AES-encrypted (WebCrypto, `src/lib/auth/refreshKey.js`) so the oni
user token can be refreshed without re-login; `UserProvider` refreshes when the token is
within 1 hour of expiry (`user/lib/tokenIsExpiring.js`).

## AD-10: Compressed, size-capped user preferences

**[inferred]** Preferences serialize through a custom array coding → JSON →
`LZString.compressToBase64`, capped at 255 chars (`MAX_PREFERENCE_LENGTH`) to fit the
backend column; `trimHistoryPreference` evicts oldest history entries to fit
(`src/lib/model/preferences.js`). Client-side: dirty flags per key, 15s autosave
(`PREFS.USER.AUTOSAVE_MILLIS`), and an explicit flush via `savePreferencesRef` before
refresh/logout (`KBContainer.refresh()`, `useLogout`). App-level preferences
(`mediaBaseURL`, `dsgConceptUrl`, `phylogenyRoot`) were split out to `ConfigProvider`
(`0c2edaab`) because they are deployment-level, not per-user.

## AD-11: UI strings externalized to JSON config

**[documented]** All labels/tooltips/alert text live in `src/config/**.json`, consumed
through the `CONFIG` registry (`src/lib/config/`). User-tunable numeric/behavioral
constants live in `src/config/constants/` (e.g. `PAGINATION`, moved from
`src/lib/constants/` on 2026-10-30), while developer structural constants stay in
`src/lib/constants/`. Enforcement is by convention; a few hardcoded strings remain in the
Users panel (see `docs/project-status.md`).

## AD-12: Provider order as a dependency graph

**[inferred]** The `KBContainer` provider order is load-bearing: `TaxonomyProvider` is
keyed by `refreshKey` so global refresh remounts everything below it;
`PreferencesProvider` needs taxonomy (root name) for normalization; `SelectedProvider`
needs preferences; `PanelDataProvider` needs selection; `ConceptProvider` needs panel data
and modals. Reordering requires checking these dependencies
(`src/components/kb/KBContainer.jsx:70-88`).

## AD-13: Version generation as a Vite plugin + gated releases

**[documented]** `src/version.js` is generated (gitignored) by
`vite-plugins/version-plugin.js` at dev start/build and by a pre-commit hook
(`scripts/version/tag.js`), using date-based `YYYY.MM.DD-HHMM` versions with git
metadata. Releases are gated: `scripts/version/check.js` requires a clean tree, lint,
full tests, and a smoke-tested deploy to a local nginx before
`scripts/version/release.js` will tag (`docs/VERSION.md`).

## AD-14: No defensive programming, minimal comments

**[documented]** Project policy (`AGENTS.md`): errors surface at their source; guards
only where a real recovery path exists; code must be self-explanatory, with rationale in
docs/commit messages. Verified in the source (~0.35 comment lines/file; errors routed to
the `Whoops` boundary or AppModal).

## AD-15: Error routing to boundaries, not local swallowing

**[inferred]** Async failures in critical paths are explicitly routed to the
`Whoops` error boundary via `showBoundary` (taxonomy initial load with
`withTimeout(LOADING.STARTUP.TAXONOMY_TIMEOUT)`, preference flush, autosave timer), while
user-recoverable failures become structured errors (`createError`/`createApiError` in
`src/lib/errors.js`) shown in AppModal. Non-critical embellishments (tree media icons)
fail silently by design (AD-7).
