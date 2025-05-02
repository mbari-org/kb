import { capitalize } from '@/lib/util'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

import { CONCEPT_NAME_TYPES } from '@/lib/constants'

// Order of types in the dropdown
const ALIAS_TYPES = [
  CONCEPT_NAME_TYPES.COMMON,
  CONCEPT_NAME_TYPES.SYNONYM,
  CONCEPT_NAME_TYPES.FORMER,
]

const ALIAS_DISPLAY_FIELDS = ['name', 'author', 'nameType']

import { fieldEdits } from '@/lib/kb/conceptState/field'

const aliasEdits = ({ initial, staged }) =>
  fieldEdits({
    stateType: CONCEPT_STATE.ALIAS,
    displayFields: ALIAS_DISPLAY_FIELDS,
    initial,
    staged,
  })

const orderedAliases = aliases => {
  const capNameTypes = aliases.map(alias => ({ ...alias, nameType: capitalize(alias.nameType) }))
  return ALIAS_TYPES.flatMap(type => sortedType(capNameTypes, type))
}

const sortedType = (aliases, type) =>
  aliases.filter(alias => alias.nameType === type).sort((a, b) => a.name.localeCompare(b.name))

export { ALIAS_TYPES, aliasEdits, orderedAliases }
