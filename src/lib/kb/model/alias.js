import { CONCEPT_NAME_TYPES } from '@/lib/constants'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'
import { fieldEdits } from '@/lib/kb/model/field'

// Prescribed order of types
const ALIAS_TYPES = [
  CONCEPT_NAME_TYPES.COMMON,
  CONCEPT_NAME_TYPES.SYNONYM,
  CONCEPT_NAME_TYPES.FORMER,
]

const ALIAS_DISPLAY_FIELDS = ['name', 'author', 'nameType']

const aliasEdits = ({ initial, staged }) =>
  fieldEdits({
    stateType: CONCEPT_STATE.ALIAS,
    displayFields: ALIAS_DISPLAY_FIELDS,
    initial,
    staged,
  })

export { ALIAS_TYPES, aliasEdits }
