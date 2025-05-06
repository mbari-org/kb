import { CONCEPT_NAME_TYPES } from '@/lib/constants'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'
import { fieldEdits } from '@/lib/kb/model/field'

import { isJsonEqual, pick } from '@/lib/util'

const ALIAS_FIELDS = ['author', 'name', 'nameType']

// Prescribed order of types
const ALIAS_TYPES = [
  CONCEPT_NAME_TYPES.COMMON,
  CONCEPT_NAME_TYPES.SYNONYM,
  CONCEPT_NAME_TYPES.FORMER,
]

const EMPTY_ALIAS = {
  author: '',
  name: '',
  nameType: ALIAS_TYPES[0],
}

const ALIAS_DISPLAY_FIELDS = ['name', 'author', 'nameType']

const aliasEdits = ({ initial, staged }) =>
  fieldEdits({
    stateType: CONCEPT_STATE.ALIAS,
    displayFields: ALIAS_DISPLAY_FIELDS,
    initial,
    staged,
  })

const aliasesEqual = (a, b) => isJsonEqual(aliasFields(a), aliasFields(b))

const aliasFields = alias => pick(alias, ALIAS_FIELDS)

// const pendingAliases = pendingHistory => {

// }

export { ALIAS_TYPES, aliasEdits, aliasesEqual, aliasFields, EMPTY_ALIAS }
