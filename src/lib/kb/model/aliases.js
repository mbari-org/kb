import { capitalize, isJsonEqual, pick } from '@/lib/utils'

import { CONCEPT_NAME_TYPES } from '@/lib/constants'

const ALIAS_FIELDS = ['id', 'author', 'name', 'nameType']

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

const aliasesEqual = (a, b) => isJsonEqual(aliasFields(a), aliasFields(b))

const aliasFields = alias => pick(alias, ALIAS_FIELDS)

const orderedAliases = aliases => {
  const capNameTypes = aliases.map(alias => ({ ...alias, nameType: capitalize(alias.nameType) }))
  return ALIAS_TYPES.flatMap(type => sortedType(capNameTypes, type))
}

const sortedType = (aliases, type) =>
  aliases.filter(alias => alias.nameType === type).sort((a, b) => a.name.localeCompare(b.name))

export { ALIAS_TYPES, aliasesEqual, aliasFields, EMPTY_ALIAS, orderedAliases }
