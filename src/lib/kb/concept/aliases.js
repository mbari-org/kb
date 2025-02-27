import { capitalize } from '@/lib/util'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'

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

const ALIAS_DISPLAY_FIELDS = ['name', 'author', 'nameType']

const aliasBorder = (isDeleted, editedAlias, editingAlias, initialAlias, theme) => {
  if (isDeleted) {
    return `${ACTION_BORDER} ${theme.palette.primary.remove}`
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
    action === CONCEPT_STATE.ALIAS.ADD
      ? theme.palette.primary.clean
      : theme.palette.primary.modified

  return `${ACTION_BORDER} ${borderColor}`
}

const aliasEdit = (aliasIndex, initialAlias, editingAlias) => {
  const { action: editingAction } = editingAlias

  if (editingAction === CONCEPT_STATE.NO_ACTION) {
    return null
  }

  const initialFields = editingAction === CONCEPT_STATE.ALIAS.ADD ? null : aliasFields(initialAlias)

  const editingFields =
    editingAction === CONCEPT_STATE.ALIAS.DELETE ? null : aliasFields(editingAlias)

  return [aliasIndex, editingAction, initialFields, editingFields]
}

const aliasEdits = (initial, editing) => {
  return initial.map((initialAlias, editingIndex) => {
    const editingAlias = editing[editingIndex]
    return aliasEdit(editingIndex, initialAlias, editingAlias)
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
