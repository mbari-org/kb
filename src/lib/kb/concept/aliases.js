import { capitalize } from '@/lib/util'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const NAME_TYPES = {
  COMMON: 'Common',
  FORMER: 'Former',
  PRIMARY: 'Primary',
  SYNONYM: 'Synonym',
}

// Order of types in the dropdown
const ALIAS_TYPES = [NAME_TYPES.COMMON, NAME_TYPES.SYNONYM, NAME_TYPES.FORMER]

const ALIAS_DISPLAY_FIELDS = ['name', 'author', 'nameType']

const aliasBorder = (alias, theme) => {
  const borderWidth = alias?.action === CONCEPT_STATE.NO_ACTION ? '1px' : '2px'
  let borderColor
  switch (alias?.action) {
    case CONCEPT_STATE.ALIAS.ADD:
      borderColor = theme.palette.primary.add
      break
    case CONCEPT_STATE.ALIAS.EDIT:
      borderColor = theme.palette.primary.edit
      break
    case CONCEPT_STATE.ALIAS.DELETE:
      borderColor = theme.palette.primary.remove
      break
    default:
      borderColor = 'none'
  }
  return `${borderWidth} solid ${borderColor}`
}

const aliasEdit = (aliasIndex, initialAlias, stagedAlias) => {
  const { action: stagedAction } = stagedAlias

  if (stagedAction === CONCEPT_STATE.NO_ACTION) {
    return null
  }

  const initialFields = stagedAction === CONCEPT_STATE.ALIAS.ADD ? null : aliasFields(initialAlias)
  const stagedFields = stagedAction === CONCEPT_STATE.ALIAS.DELETE ? null : aliasFields(stagedAlias)

  return [aliasIndex, stagedAction, initialFields, stagedFields]
}

const aliasEdits = (initial, staged) => {
  return staged.map((stagedAlias, stagedIndex) => {
    const initialAlias = initial[stagedIndex]
    return aliasEdit(stagedIndex, initialAlias, stagedAlias)
  })
}

const aliasFields = alias =>
  ALIAS_DISPLAY_FIELDS.reduce((fields, field) => {
    fields.push([field, alias[field]])
    return fields
  }, [])

const hasSameValues = (anAlias, otherAlias) => {
  return (
    anAlias.author === otherAlias?.author &&
    anAlias.name === otherAlias?.name &&
    anAlias.nameType === otherAlias?.nameType
  )
}

const orderedAliases = aliases => {
  const capNameTypes = aliases.map(alias => ({ ...alias, nameType: capitalize(alias.nameType) }))
  return ALIAS_TYPES.flatMap(type => sortedType(capNameTypes, type))
}

const sortedType = (aliases, type) =>
  aliases.filter(alias => alias.nameType === type).sort((a, b) => a.name.localeCompare(b.name))

export { ALIAS_TYPES, aliasBorder, aliasEdits, NAME_TYPES, orderedAliases }
