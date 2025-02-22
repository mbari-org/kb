import { capitalize } from '@/lib/util'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

const NAME_TYPES = {
  COMMON: 'Common',
  FORMER: 'Former',
  PRIMARY: 'Primary',
  SYNONYM: 'Synonym',
}

// Order of types in the dropdown
const ALIAS_TYPES = [NAME_TYPES.COMMON, NAME_TYPES.SYNONYM, NAME_TYPES.FORMER]

const NO_ACTION_BORDER = 'none'
const ACTION_BORDER = '2px solid'

const hasSameValues = (anAlias, otherAlias) => {
  return (
    anAlias.author === otherAlias?.author &&
    anAlias.name === otherAlias?.name &&
    anAlias.nameType === otherAlias?.nameType
  )
}

const aliasBorder = (isDeleted, editedAlias, editingAlias, initialAlias, theme) => {
  if (isDeleted) {
    return `${ACTION_BORDER} ${theme.concept.color.remove}`
  }

  if (
    editedAlias.action === CONCEPT_STATE.NO_ACTION &&
    editingAlias.action === CONCEPT_STATE.NO_ACTION
  ) {
    return NO_ACTION_BORDER
  }

  const action =
    editingAlias.action !== CONCEPT_STATE.NO_ACTION ? editingAlias.action : editedAlias.action

  if (
    action === CONCEPT_STATE.NO_ACTION ||
    (hasSameValues(editedAlias, initialAlias) && hasSameValues(editingAlias, initialAlias))
  ) {
    return NO_ACTION_BORDER
  }

  const borderColor =
    action === CONCEPT_STATE.ALIAS_ADD ? theme.concept.color.clean : theme.palette.primary.main

  return `${ACTION_BORDER} ${borderColor}`
}

const orderedAliases = aliases => {
  const capNameTypes = aliases.map(alias => ({ ...alias, nameType: capitalize(alias.nameType) }))
  return ALIAS_TYPES.flatMap(type => sortedType(capNameTypes, type))
}

const sortedType = (aliases, type) =>
  aliases.filter(alias => alias.nameType === type).sort((a, b) => a.name.localeCompare(b.name))

export { ALIAS_TYPES, aliasBorder, NAME_TYPES, orderedAliases }
