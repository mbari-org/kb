import { CONCEPT } from '@/lib/constants'
import { SELECTED } from '@/lib/constants/selected.js'

const { REALIZATIONS, REFERENCES, TEMPLATES } = SELECTED.SETTINGS

const buildFilters = (conceptKey, defaults) => {
  const DEFAULT_FILTERS = { ...defaults }
  const EMPTY_FILTERS = {
    [conceptKey]: '',
    ...DEFAULT_FILTERS,
  }
  return { DEFAULT_FILTERS, EMPTY_FILTERS }
}

const LINK_FILTERS = buildFilters(TEMPLATES.FILTERS.CONCEPT, {
  [TEMPLATES.FILTERS.TO_CONCEPT]: '',
  [TEMPLATES.FILTERS.LINK_NAME]: '',
  [TEMPLATES.FILTERS.LINK_VALUE]: '',
})

const REFERENCE_FILTERS = buildFilters(REFERENCES.FILTERS.CONCEPT, {
  [REFERENCES.FILTERS.CITATION]: '',
  [REFERENCES.FILTERS.CONCEPTS]: '',
  [REFERENCES.FILTERS.EXTENT]: CONCEPT.EXTENT.SOLO,
})

const PANEL_FILTERS = {
  [REALIZATIONS.KEY]: LINK_FILTERS,
  [REFERENCES.KEY]: REFERENCE_FILTERS,
  [TEMPLATES.KEY]: LINK_FILTERS,
}

const dataFilters = panel => {
  const filters = PANEL_FILTERS[panel]
  if (!filters) {
    throw new Error(`Unknown panel filters: ${panel}`)
  }
  return filters
}

export default dataFilters
