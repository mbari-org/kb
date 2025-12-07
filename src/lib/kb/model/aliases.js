import { capitalize, isJsonEqual, pick } from '@/lib/utils'

import alias from '@/config/text/alias.json'

const ALIAS = alias.ALIAS

const ALIAS_FIELDS = ['id', 'author', 'name', 'nameType']

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

export { aliasesEqual, aliasFields, EMPTY_ALIAS, orderedAliases }
