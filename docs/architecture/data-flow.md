# Data Flows and Execution Paths

Important execution paths, traced against the code on 2026-11-06. Each step names the
file and function that implements it.

## 1. API call (universal transport)

1. Context/component calls a wrapper in `src/lib/api/<domain>.js`.
2. The wrapper builds request pieces via `src/lib/services/url.js` (`apiUrl`) and
   `src/lib/services/params.js` (`apiParams`, `paramsQs`).
3. `src/lib/services/request.js:5-31` — curried `request(service, method, tokenType)`:
   - `tokenType === 'user'` → oni user token (`config.getOniUserToken()`, refresh via
     `config.refreshOniUserToken()`); used for attributed mutations
     (`oniUserDelete/Post/Put` in `src/lib/services/oni/methods.js`).
   - otherwise → per-service token (`config.getServiceToken(service)`); used for reads.
   - On `result.status === 401`: exactly **one** retry with a refreshed token.
4. `src/lib/services/send.js` (`apiSend`) performs the `fetch` and normalizes results:
   `{payload, status}` on 200, `{error: createApiError(...), status}` otherwise.
5. Contexts unwrap via `ConfigContext.apiFns` (`apiPayload`, `apiPaginated`, `apiResult`,
   `apiRaw`) — never raw `fetch` outside `src/lib/services/`.

## 2. App startup and authentication

1. `AuthRoute.jsx:11` — KB routes render only when `user && config?.valid`; otherwise
   `StartUp` (`ConfigForm` always; `ReadOnlyLogin` + `LoginForm` fade in once the config
   is not dirty).
2. `ConfigProvider.updateConfig` (`src/contexts/config/ConfigProvider.jsx:47`) →
   `validateConfigUrl` → persist URL in `configUrl` localStore; clears authStore and
   service tokens.
3. `authenticateConfig` (line 73) → `getEndpoints`
   (`src/lib/services/config/getEndpoints.js`; Bearer header, 5s `AbortSignal.timeout`,
   local-dev URL rewrites) → `createServiceLookup` → `createServiceTokenManager`
   (`src/lib/services/auth/serviceTokens.js`) → prefetch `annosaurus` + `oni` service
   tokens (and oni user token for non-readonly logins).
4. Login: `LoginForm` (React `useActionState`) → `loginUser`
   (`src/lib/services/auth/login.js:23`) — Basic-auth POST returning
   `{auth: {token, refresh}}` where `refresh = await genRefresh(password)`
   (`src/lib/auth/refreshKey.js`, WebCrypto AES, params from
   `src/config/security.json`). `loginReadOnly` uses a hardcoded dummy JWT (exp 2222).
5. `useProcessAuth` (`src/contexts/user/lib/useProcessAuth.js`): `processToken` decodes
   the JWT; for non-readonly extracts the password from `auth.refresh`; calls
   `authenticateConfig`; fetches the user profile; `authStore.set(...)` + `setUser`.
   Session restore on reload replays `authStore.get()` through the same path
   (`useAuthUser`).
6. Refresh cycle: `UserProvider.jsx:43-63` effect → `useRefreshUser` → `tokenIsExpiring`
   (`user/lib/tokenIsExpiring.js:3`: `Date.now()/1000 + 3600 >= expiry` — a 1-hour
   window). Refresh re-runs `loginUser` with the stored decrypted password; failure →
   `useInvalidAuth` → back to login.
7. Logout: `useLogout` awaits `savePreferencesRef.current?.()` (preference flush), then
   `clearStores()` + `clearAuthenticatedConfig()` + `setUser(null)`.

## 3. Taxonomy loading and tree navigation

1. Initial load: `TaxonomyProvider.jsx:371-409` effect → `loadTaxonomy(apiFns)`
   (`src/lib/model/taxonomy.js:204`): parallel `getRoot`/`getNames`/`getRanks`, then root
   concept + aliases, then `loadTaxonomyConcept` look-ahead hydration. Wrapped in
   `withTimeout(LOADING.STARTUP.TAXONOMY_TIMEOUT)`; failures go to the error boundary.
2. Tree expand (disclosure click): `ConceptsTree` (MUI `RichTreeView`, custom
   `ConceptTreeItem` slots, items memoized via `buildTreeItems` node-identity caches) →
   `useConceptClick.js:12`:
   - expanded → `EXPAND.OFF`: collapse prunes all descendants from `expandedItems`
     (`useExpandConcept.js:40-46`).
   - collapsed → `EXPAND.SELF` → `expandSelf` adds the id and calls
     `TaxonomyProvider.loadConceptChildren` (line 342; skipped when children already
     loaded) → `loadTaxonomyConceptGrandchildren` → per-child
     `loadTaxonomyConceptChildren` → `apiChildren` GET → `updateTaxonomy` commit.
   - Alt/Opt-click → `EXPAND.DESCENDANTS` (`useExpandConcept.js:68`): wrapped in
     `beginProcessing(CONCEPT_DESCENDANTS)`; `loadConceptDescendants` →
     `loadTaxonomyConceptDescendants` (taxonomy.js:447) — a **single** `phylogeny/down`
     call (`getConceptPhylogenyDown`) merging structure-only stubs; then expands all
     expandable names.
3. Media icons for tree nodes fill in asynchronously after the structure commits:
   `loadTaxonomyConceptDescendants` returns `mediaNames`, and
   `TaxonomyProvider.fillConceptMedia` (line 295) streams batched `getMedia` fetches
   (`loadConceptMediaIncremental`, batches of 6, flush every 60) via functional
   `setTaxonomy` updates, so concept switches/edits mid-fill are never clobbered and
   media failures never reach the error boundary.
4. Concept-path loading (expand/scroll to current concept): `ConceptProvider.jsx:325-380`
   — on concept change, use the `conceptPathsRef` cache or call `getConceptPhylogenyUp`
   (`src/lib/api/concept.js:38`), parse the nested `children[0]` chain into a path, cache
   it, `setConceptPath(path)`. `ConceptsTree.jsx:84-91` merges `conceptPath` into
   `expandedItems`; `useConceptAutoExpand` handles first-load expansion;
   `useConceptsTreeScroll.jsx` smooth-scrolls to the node (bounded 100ms × 80 poll,
   cancels on user scroll). `relabelConceptPaths` rewrites the cache on rename;
   `resetConceptPaths` clears it on re-parent.

## 4. Concept editing state machine

1. `conceptStateReducer`
   (`src/contexts/panels/concepts/staged/edit/conceptStateReducer.js`) — the app's only
   reducer. Dispatches `CONCEPT_STATE` actions (`src/lib/constants/conceptState.js`) to
   per-field handlers imported from `src/lib/concept/state/`.
2. Per-field contract (modules: aliases, author, children, media, name, parent, rank,
   realizations, templates, value): `initialState(concept, pendingConcept)`,
   `isModified(initial, staged)`, `stateUpdates(initial, staged)`, plus `edit*`/`reset*`
   handlers. Aggregated by `src/lib/concept/state/state.js` (`initialConceptState`,
   `isStateModified`) and `staged/edit/stateUpdates.js` (`stateUpdatesInfo`).
3. Reset-confirm flow: `useModifyConcept.js` intercepts reset actions into
   `confirmingDiscard`; the confirm UI (`StagedActions`) replays `CONFIRMED.YES` through
   `resetConceptState.js` (re-dispatch with `initialState` slices) or clears on
   `CONFIRMED.NO`. After a reset lands (`isStateModified` false), any deferred guarded
   action runs.
4. Context split: `ConceptContext` (low-frequency: concept, conceptPath, isEditing,
   initialState, pending, …) vs `ConceptStagedContext` (keystroke-frequency:
   `stagedState`, `modifyConcept`, `confirmReset`) — both provided inline by
   `ConceptProvider.jsx:382-386`.

## 5. Concept save

1. `StagedActions.jsx:128` (`.../change/staged/modal/`) — `await saveStaged()`, then
   `handleSpecialAction()` completes any pending guarded action (concept/panel change,
   logout, refresh).
2. `useSaveStaged` (`src/contexts/panels/concepts/staged/save/useSaveStaged.js:32`) wraps
   everything in `withProcessing(PROCESSING.SAVE)`; dependencies gathered via
   `useUpdatesContext`.
3. `submitStaged` (`submitStaged.js:14`) — computes `stateUpdatesInfo(initialState,
   stagedState)`, then one `Promise.all` over the **8 submitters**: `submitAliases`,
   `submitAuthor`, `submitChildren`, `submitMedia`, `submitName`, `submitParent`,
   `submitRank`, `submitRealizations` (`staged/save/submitter/*`). Any `.error` results
   are grouped by field and thrown as `createError('Concept Save Error', …)`. Note:
   `templates` is a staged field but has **no submitter** — template changes flow through
   the pending workflow instead.
4. If the concept was renamed: `applyRenameSideEffects.js` — (a) `performReassignments`
   over `relatedDataCounts` entries with `value > 0` (each entry's `reassignFn({old,
   new})`); (b) local realization-cache relabels (`renameConceptRealizations` re-keys
   the concept's own items and rewrites their `concept` field;
   `renameRealizationToConceptNames` rewrites cached `toConcept` values — the server
   cascades both sides of a rename, so no realization refetch is needed); (c) prefs
   history rewrite (`conceptPrefsUpdate` maps old→new in `KEY.CONCEPTS`); (d) template
   filter rewrite (`settingsUpdate` rewrites `templates.filters.concept`/`toConcept`);
   (e) `savePreferences` ×2 plus `refreshPanelData` for REFERENCES, TEMPLATES.
5. `relabelConceptPaths(old, new)` when NAME changed without PARENT (paths are
   unchanged except for the renamed element); `resetConceptPaths()` when PARENT
   changed; `reloadConceptRealizations` when REALIZATIONS changed.
6. Refetch: `apiPayload(getConcept, conceptName)` → `normalizeConcept` — skipped for a
   **pure rename** (only NAME staged): the fresh concept is built locally as
   `{ ...staleConcept, name }` (minus UI-attached `realizations`/`templates`; media is
   reused, or fetched alone if not yet loaded), since a rename changes nothing else
   on the server.
7. `applyUpdateResults` (`applyUpdateResults.js:9`) — seeds fresh aliases/alternateNames/
   children/parent from stale, then dispatches results through the **5 appliers**
   (`applyAliasResults`, `applyAuthorResults`, `applyChildrenResults`,
   `applyParentResults`, `applyRankResults` in `staged/save/applier/*`); name comes from
   the refetch, media is not re-applied.
8. `refreshPanelData(PANEL_DATA.PENDING_HISTORY)` → `conceptEditsRefresh(freshConcept,
   staleConcept)` (TaxonomyProvider reconciliation) → `setConcept(updatedConcept,
   pendingHistory)` → `setEditing(false)` → `updateSelected({concept})` → `closeModal()`.

## 6. Pending-history approval/rejection

1. Entry hooks: `useConceptUpdatePending`
   (`src/contexts/panels/concepts/pending/useConceptUpdatePending.js`) maps selected
   pending ids to items, orders them (accept replays in creation order with Add first
   and Delete last; reject undoes in reverse creation order with Add/Delete last —
   ONI cascades removal of a concept's remaining pending items on approved
   child-delete and rejected child-add, and reject-undo must pop dependent changes
   first, e.g. an alias add of an old name must be rejected before the rename that
   made it available), and wraps in
   `withProcessing(PROCESSING.UPDATE)`;
   `useHistoryUpdatePending` (`src/contexts/panels/history/useHistoryUpdatePending.js`)
   handles single items without the processing overlay. Both build the orchestrator
   `deps` object via `useProcessPendingDeps`
   (`src/contexts/common/useProcessPendingDeps.js`).
2. Orchestrator `processPendingApproval`
   (`src/lib/concept/pending/processPendingApproval.js:13`):
   a. Groups items by `item.concept` and resolves each group's stale concept
      (`loadConcept`) **before** submitting anything — approvals can rename or remove
      concepts server-side (e.g. a rejected rename restores the old name), after which
      fetching the pre-approval name would 404.
   b. Sequential `apiPayload(updatePendingItem, [approval, item.id])` PUTs
      (`src/lib/api/history.js`) in the order given by the entry hook.
   c. `resetConceptPaths()` if any item touches NAME/PARENT (`structuralFields`),
      approve or reject.
   d. `Promise.all` of `refreshData(PENDING_HISTORY)` + `reloadConceptRealizations` for
      concepts with REALIZATION-field items (there is **no REALIZATION case** in the
      mutator switch — realization approvals are handled by this cache reload).
   e. Per concept group: `cloneStale(apiFns, staleConcept, false)` — a purely **local**
      clone (no server refetch) — then `applyRejects` / `applyApprovals`, then
      `conceptEditsRefresh(freshConcept, staleConcept)`; `updateSelected` if renamed.
3. Mutator dispatch: `HISTORY_FIELD` switches in `src/lib/concept/pending/applyApproves.js:11`
   and `applyRejects.js:11` route to the pure mutators in
   `src/contexts/panels/concepts/pending/{approve,reject}/` (alias, child, media, rank,
   template, value). ONI uses the field string `ConceptName` for both primary-name
   renames and alias changes (`HISTORY_FIELD.NAME` and `HISTORY_FIELD.ALIAS` are the
   same string), so the `ConceptName` case disambiguates via `isPendingName`
   (field + `Edit` action + `concept === newValue`): primary renames go to
   `approveValue`/`rejectValue` (set/restore `concept.name`), everything else to
   `approveAlias`/`rejectAlias`. PARENT uses `approveValue`/`rejectValue`. Unknown
   fields throw `createError('Invalid Pending Field')`.
4. The optimistic result is applied via `setConcept(optimisticConcept, pendingHistory)`.
   The returned `concepts` map is keyed by the items' `concept` (the displayed,
   pre-rename name) so the Concepts panel finds the optimistic concept after a rename
   is approved or rejected; `processPendingApproval` itself calls `updateSelected`
   with the new name when a rename changes `concept.name`.

## 7. Preferences persistence

1. `PreferencesProvider` wires `useInitPrefs`, `usePrefsTimer`, `useSavePrefs`, and
   assigns `flushPreferences` to `UserContext.savePreferencesRef` (lines 126-128).
2. Init (`useInitPrefs.js:122`): `getPreferences()`; empty → `createPreferences` for all
   three keys; else `normalizeConceptPreferences` (drop invalid names/adjacent
   duplicates, adjust `position`, fallback `[rootName]`) and
   `normalizeHistoryPreferences` (fallback `['Concepts'`]); initialize concept/panel
   selection and settings; write back normalized diffs via `updatePreferences`.
3. Dirty flags set in `onConceptChange`/`onPanelChange`/`onSettingsChange`, keyed by
   `PREFS.USER.KEY` (`concepts`/`panels`/`settings`).
4. Autosave: `usePrefsTimer.js:26` — `setInterval(PREFS.USER.AUTOSAVE_MILLIS)` (15 000 ms,
   `src/lib/constants/prefs.js`); saves only dirty keys; errors → error boundary.
5. Flush: `useSavePrefs.flushPreferences` (line 113) saves **all three** keys, waits out
   in-flight saves, resets flags and timer. Called by `KBContainer.refresh()` (before the
   remount key changes) and by `useLogout`.
6. Serialization: `src/lib/model/preferences.js` — custom array coding per preference
   type → `JSON.stringify` → `LZString.compressToBase64`;
   `trimHistoryPreference` shifts oldest entries until ≤ 255 chars
   (`MAX_PREFERENCE_LENGTH`, matching `PREFS.USER.MAX_LENGTH`); throws if still over.
7. App-level preferences (`mediaBaseURL`, `dsgConceptUrl`, `phylogenyRoot`) are separate:
   owned by `ConfigProvider`/`useAppPreferences`, edited via `nav/appInfo/`.

## 8. Table-panel data flow (example: Realizations)

1. `RealizationsProvider` (`src/contexts/panels/realizations/RealizationsProvider.jsx`)
   reads the shared caches from `PanelDataContext`
   (`loadAllRealizations`/`ensureConceptRealizations`/`getAllRealizations`/
   `getConceptRealizations`/`pendingHistory`).
2. Concept filter defaults to the selected concept; filter changes trigger per-concept or
   full loads; `filteredRealizations` applies concept/toConcept/linkName/linkValue
   filters via `useMemo`. Filter state persists through `SelectedSettingsContext`.
3. CRUD: `useModifyRealizations.js` — `createRealization`/`updateRealization`/
   `deleteRealization` via `apiFns.apiPayload`, each followed by
   `Promise.all([reloadConceptRealizations(concept), refreshData(PENDING_HISTORY)])`.
4. Pending gating: `getPendingRealizationItem` matches pending history
   (`HISTORY_FIELD.REALIZATION`, same concept, matching realization string);
   `useRealizationColumns.jsx:33-46` renders a `StampIcon` (admin only) opening the
   approve/reject modal instead of edit/delete actions; row classes
   `pending-realization-{add,delete,edit}` add colored borders.
5. Export: `useRealizationsExport.js` → `csvExport` (`src/lib/csvExport.js`, File System
   Access API) with progress routed to the AppModal processing overlay and an
   export-complete modal.

## 9. Global refresh

`KBContainer.jsx:46-64` — `refresh()` awaits `savePreferencesRef.current()` (preference
flush; errors go to the error boundary via `showBoundary`), then `setRefreshKey(id24())`,
which remounts `TaxonomyProvider` and its entire subtree with fresh state.
