import { capitalize } from '@/lib/util'

const NAME_TYPES = {
  COMMON: 'Common',
  SYNONYM: 'Synonym',
  FORMER: 'Former',
  PRIMARY: 'Primary',
}

const ALTERNATE_NAME_TYPES = [NAME_TYPES.COMMON, NAME_TYPES.SYNONYM, NAME_TYPES.FORMER]

const orderedNames = names => {
  const capNameTypes = names.map(name => ({ ...name, nameType: capitalize(name.nameType) }))
  return ALTERNATE_NAME_TYPES.flatMap(type => sortedType(capNameTypes, type))
}

const sortedType = (names, type) =>
  names.filter(name => name.nameType === type).sort((a, b) => a.name.localeCompare(b.name))

export { ALTERNATE_NAME_TYPES, NAME_TYPES, orderedNames }
