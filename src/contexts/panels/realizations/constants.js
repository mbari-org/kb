import { SELECTED } from '@/lib/constants/selected.js'

const { REALIZATIONS } = SELECTED.SETTINGS
const { CONCEPT, TO_CONCEPT, LINK_NAME, LINK_VALUE } = REALIZATIONS.FILTERS

const EMPTY_FILTERS = {
  [CONCEPT]: '',
  [TO_CONCEPT]: '',
  [LINK_NAME]: '',
  [LINK_VALUE]: '',
}

export { EMPTY_FILTERS }
