# Project Status

Snapshot taken 2026-11-06. Sources: `git log`, `package.json`, the untracked working
notes in `tmp/` (`release.txt`, `ONI.txt`), and code inspection. Facts are verified
against the working tree; items marked *(draft notes)* come from `tmp/release.txt` /
`tmp/ONI.txt`, which are the developer's untracked working files.

## Where things stand

- Current branch: `load-media`. HEAD `e13ee345` (2026-11-06, "Add Realization
  processing"). Working tree has uncommitted changes in
  `src/lib/model/taxonomy.js`, `src/contexts/taxonomy/TaxonomyProvider.jsx`, and
  `test/contexts/taxonomy/TaxonomyProvider.test.jsx` — the incremental async media-icon
  fill for the concept tree (`fillConceptMedia` / `loadConceptMediaIncremental`; see
  `docs/architecture/data-flow.md` §3).
- Latest release: `v2026.11.03-1812` (matches `package.json` version).
- ~86 commits since 2026-09-01. Recent work themes:
  1. **Concept tree navigation overhaul** — disclosure expand/collapse semantics,
     collapse-pruning, Alt/Opt-click expand-all, phylogeny-based loading
     (`phylogeny/up` for concept path, `phylogeny/down` single-call descendants),
     auto-scroll fixes, pending color-coding.
  2. **Realizations panel build-out** — edit from both Concepts and Realizations panels,
     cross-panel sync, in-panel approve/reject, add-realization processing, duplicate
     linkRealization handling, on-demand per-concept loading.
  3. **Render-performance work** — context splits (Concept staged, Selected settings,
     Concept-modal data/processing), memo/callback fixes, panel lazy-loading, `yarn
     profile` build mode.
  4. **Modal DRY rework** (`e05bf438`, 2026-10-31) — shared `PanelModalProvider` +
     per-panel factory instances + `ModalShell.jsx`.
- Tests: ~115 test files (grew ~24% since 2026-09-06), Vitest + jsdom, integration-heavy.

## Known issues

1. **Concept tree selection flash** *(draft notes)* — "slightly annoying flash" on tree
   selection, a side effect of the navigation optimizations; documented as a known issue
   in the v2026.11.03 release notes draft.
2. **N+1 media fetch on expand-all** — loading media icons requires one media API call
   per descendant concept and "can still take seconds" *(draft notes)*. The `load-media`
   branch work (incremental batched fill) mitigates the UX; `tmp/measure-phylogeny-media.mjs`
   measures it.
3. **Duplicate linkRealization IDs from the API** — the backend can return the same
   linkRealization object 3-4× in one response (`d040ea93` works around it;
   `tmp/duplicate_realization_ids.tsv` + `tmp/realizations.json` document it).
4. **History concept-sort requires an ONI backend fix** *(draft notes)*.
5. **ONI Swagger/implementation mismatch** in `v1/phylogeny/basic/{name}` — draft message
   to backend maintainer in `tmp/ONI.txt`.
6. **User lock is local-only** — `UsersProvider.lockUser`
   (`src/contexts/panels/users/UsersProvider.jsx:42-50`) has the backend call commented
   out under `// CxTmp until locked is implemented in the backend`; lines 60-61 also fake
   `locked: false` on every user load (`cxTmpUsers`).

## Placeholders and dead code

- **Notes and Embargoes panels** are `EmptyPanel` placeholders (no functionality).
- `src/components/common/CxTBD.jsx` — placeholder component with **zero consumers**;
  dead code, candidate for deletion.
- No TODO/FIXME/HACK comments anywhere in `src/` or `test/` (the `Cx`-prefix convention
  is used instead; only the two `CxTmp` sites in `UsersProvider.jsx` remain).
- The dead-code list in older docs is partly stale: `src/contexts/selected/useSelected.js`
  and `src/contexts/panels/history/useHistoryData.js` have been **deleted** since.

## Technical debt

1. **Four-way `*ModalUtils.jsx` duplication** — `realizationModalUtils.jsx` (400 lines),
   `userModalUtils.jsx` (272), `templateModalUtils.jsx` (261), `referenceModalUtils.jsx`
   (252) independently re-implement form+modal plumbing (all import `diff`/`filterObject`/
   `pick` from `lib/utils`, destructure `CONFIG.BUTTON`). Candidate for a shared
   modal-utils factory; the "DRY edit modals" rework addressed the modal shell but not
   these utils.
2. **Cross-panel deep coupling** — `realizationModalUtils.jsx` imports five modules from
   deep inside the Concepts panel (`.../concepts/concept/change/staged/realizations/edit/…`);
   the Realizations panel reuses Concepts-panel editing internals rather than shared
   components.
3. **Hardcoded UI strings in the Users panel** — `UserForm.jsx` labels/helper text and
   `useUserColumns.jsx` `headerName`s bypass the `CONFIG` registry (convention violation,
   not precedent).
4. **`yarn version:test-deploy` runs the gate twice** — the script is
   `check.js && test-deploy.js`, but `check.js` already runs test-deploy
   (`package.json:60`).
5. **`build.sh` push asymmetry** — the arm64/buildx path pushes both `mbari/kbeditor:<tag>`
   and `:latest`; the non-arm64 path pushes only `:latest` (version-tagged image is built
   but not pushed).
6. **Unused `classnames` dependency** — declared in `package.json`, no observed usage in
   `src/`.
7. **Hot-spot files** — `src/lib/model/taxonomy.js` (~660 lines) and
   `src/contexts/taxonomy/TaxonomyProvider.jsx` (~420) carry the most complexity and the
   most churn; changes there warrant running the taxonomy context + tree component tests.

## Stale documentation

- **`README.md` is heavily stale** (claims Axios, MUI v6, Vite 6, nonexistent `src/hooks/`,
  `src/lib/kb/`, `src/lib/store/`, `src/components/config/` dirs, a stale context list,
  `TaxonomyTree.jsx` instead of `ConceptsTree.jsx`, and placeholder License/Contributing/
  Support sections despite a `LICENSE` file existing). Needs a rewrite or a pointer to
  `docs/`.
- **`docs/VERSION.md`** — accurate except its "Core Files" section references
  `scripts/generate-version.js` and `scripts/release-version.js`, which no longer exist
  (actual: `scripts/version/{tag,check,release,test-deploy,common}.js`).
- `docs/CODEBASE_INDEX.md` was refreshed 2026-11-06 alongside this file (panel-modal
  location, `usePageGo` rename, test count, dead-code list).

## Outstanding product questions *(draft notes)*

- Realizations can be edited/deleted from panels but not **added** — whether to expose
  add-new-Realization is an open product question (noted in the release-notes draft).
