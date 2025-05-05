import { ALIAS_TYPES } from './alias'

import { capitalize } from '@/lib/util'

const orderedAliases = aliases => {
  const capNameTypes = aliases.map(alias => ({ ...alias, nameType: capitalize(alias.nameType) }))
  return ALIAS_TYPES.flatMap(type => sortedType(capNameTypes, type))
}

const sortedType = (aliases, type) =>
  aliases.filter(alias => alias.nameType === type).sort((a, b) => a.name.localeCompare(b.name))

export { orderedAliases }
