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
(current work on branch `load-media`). Batches are also held while the Concepts panel is inactive:
`setMediaSuspended` (`TaxonomyProvider.jsx`) is driven from `Panels.jsx`, and the fill resumes when
Concepts is selected again. History reloads are keyed on the selected concept's children, not on
`getConcept`, so media-only commits do not reload History.

## AD-8: API layering and result convention

**[documented]** Four layers, one direction: `src/lib/api/*` (per-domain wrappers) →
`src/lib/services/<svc>/methods.js` (verb bindings) → `src/lib/services/request.js`
(token attach, exactly one 401 retry with refreshed token) → `fetch`. Results are always
`{payload}` / `{error, status}`; contexts unwrap through `ConfigContext.apiFns`. No HTTP
library (no axios — the README's claim is stale). Reads use per-service JWTs; attributed
mutations use the oni *user* token (`oniUser*` bindings) so the backend can attribute
changes to the logged-in user. Which helper a call uses (`apiPayload`, `apiWrite`, `apiRaw`) is decided in AD-16.

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
the `Whoops` boundary.

## AD-15: Error routing to the boundary, not local swallowing

**[documented]** Request and write failures reach the user through the `Whoops` error boundary (`showBoundary`). `AppModal` renders app-level dialogs only (logout confirm, export complete, app info) and has no error display. Critical async failures are routed there explicitly (taxonomy initial load with `withTimeout(LOADING.STARTUP.TAXONOMY_TIMEOUT)`, preference flush, autosave timer). Which helper a call uses decides where its failure lands (AD-16). Non-critical embellishments (tree media icons) fail silently by design (AD-7).

## AD-16: Reads, writes, and caller-checked calls use separate API helpers

**[documented]** `apiPayload` shows the error boundary on failure and resolves `undefined`, so a write made through it looked successful to its caller: save and delete flows continued past a failed write, and a failed DELETE still removed the concept from the tree. Decision: reads use `apiPayload`, `apiPaginated`, or `apiResult`. Writes whose result decides the next step use `apiWrite`, which throws `{...error, status}` and shows nothing. Calls that need the error as data use `apiRaw`, and the caller checks `error`. Consequences: a write caller must not catch and continue, and `status` is available for later decisions about ambiguous outcomes (500 or no response). Writes still on `apiPayload` are listed as known debt in `docs/project-status.md`. Evidence: `src/contexts/config/useApiFns.js` and the Phase 0 commit.

## AD-17: Identity-sensitive writes address ids

**[documented]** Writes that change or remove a concept, its primary name, or one of its aliases address ONI ids, not names. Parent and rank use `concept.id` (`PUT /concept/id/{id}`). Rename and author use the primary name's id (`PUT /names/id/{id}`). Alias edit and delete use the alias's id (`PUT` and `DELETE /names/id/{id}`), and concept delete uses `DELETE /concept/id/{id}`. The save path reads these ids from the effective state. Alias create stays anchored on the current primary name, and an alias added in a save takes its id from the add response. Approvals re-read names when they change aliases. Data that ONI stores by name stays name-keyed: link and history values, preferences, and annosaurus. A name-addressed write resolves to whichever name currently holds that string, so a retry after an ambiguous rename can get a 404 or 400 instead of the intended name. An id-addressed write does not have that problem. Evidence: `src/lib/api/concept.js`, `src/lib/concept/state/effectiveState.js`, and `src/contexts/panels/concepts/staged/save/submitter/`.

## AD-18: Post-write state comes from the server's responses

**[documented]** After a save, a concept's names, author, rank, and children are rebuilt from what the server returned for each write, not from the request. A `RawConcept` response to a name write lists every name of the concept with its id, so a rename, an author change, or an alias add, edit, or delete replaces the names from that snapshot. A `ConceptMetadata` response to a concept write supplies the rank. Parent is the exception: the response has no parent, so the accepted `parentName` stands, and a 200 means the move committed. Results apply in journal order, and each response already includes the writes that completed before it, so the last snapshot is the server's state. Maintainers' writes are applied and recorded as pending history, so their responses already reflect the change, and an alias that a maintainer only marks for deletion is still listed. Evidence: `src/contexts/panels/concepts/staged/save/applier/`, and `snapshotFromRawConcept` in `src/lib/model/aliases.js`.

## AD-19: Ambiguous write outcomes reload from the server

**[documented]** A write whose response is a 5xx or missing (a network failure) may or may not have been applied. ONI returns 500 when a commit fails, and a gateway can return 502–504 after the upstream commits. `isAmbiguousWriteError` (`src/lib/errors.js`) classifies these, and `submitStaged` records the result on the Concept Save Error. The save stops at that operation: nothing is retried, and no later operation runs. The user sees a save-outcome-unknown modal that stays open until Reload. Reload re-reads the concept by id and its names by primary name id, reads children and parent by name (ONI has no by-id structure route), and replaces the concept state, discarding staged edits. Reconciling each operation separately would need a read per field kind, so one reload path covers all of them. A 4xx (400, 403, 404) means the write was not applied, so the save reports the error through the boundary (AD-15). Evidence: `src/contexts/panels/concepts/staged/save/submitStaged.js`, `src/contexts/panels/concepts/staged/save/useReloadConcept.js`, and `loadConceptById` in `src/lib/model/concept.js`.
