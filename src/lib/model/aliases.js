import { capitalize, isJsonEqual, pick } from '@/lib/utils'

import { getConceptNames } from '@/lib/api/concept'
import { ALIAS } from '@/lib/constants/alias.js'
import { FIELDS } from '@/lib/config/fields.js'

const { AUTHOR, ID, NAME, NAME_TYPE } = FIELDS.ALIAS
const ALIAS_FIELDS = [ID, AUTHOR, NAME, NAME_TYPE]

const EMPTY_ALIAS = {
  author: '',
  name: '',
  nameType: ALIAS.TYPE[0],
}

const aliasesEqual = (a, b) => isJsonEqual(aliasFields(a), aliasFields(b))

const aliasFields = alias => pick(alias, ALIAS_FIELDS)

const orderedAliases = aliases => {
  const nameTypes = aliases.map(alias => ({ ...alias, nameType: capitalize(alias.nameType) }))
  return ALIAS.TYPE.flatMap(type => sortedType(nameTypes, type))
}

const sortedType = (aliases, type) =>
  aliases.filter(alias => alias.nameType === type).sort((a, b) => a.name.localeCompare(b.name))

const loadAliases = async (apiFns, concept) => {
  if (concept.aliases) {
    return concept.aliases
  }
  const aliases = await apiFns.apiPayload(getConceptNames, concept.name)
  return orderedAliases(aliases)
}

export { aliasesEqual, aliasFields, EMPTY_ALIAS, loadAliases, orderedAliases }
