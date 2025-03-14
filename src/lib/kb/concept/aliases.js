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
const aliasFields = alias =>
  ALIAS_DISPLAY_FIELDS.reduce((fields, field) => {
    fields.push([field, alias[field]])
    return fields
  }, [])

const aliasEdit = (index, initialAlias, stagedAlias) => {
  const { action } = stagedAlias

  if (action === CONCEPT_STATE.NO_ACTION) {
    return null
  }

  const initialFields = action === CONCEPT_STATE.ALIAS.ADD ? null : aliasFields(initialAlias)
  const stagedFields = action === CONCEPT_STATE.ALIAS.DELETE ? null : aliasFields(stagedAlias)

  return [action, index, initialFields, stagedFields]
}

const deleteAlias = edit => {
  const [action, index, _initialFields, _stagedFields] = edit
  return {
    action,
    index,
    updates: {},
  }
}

const editAlias = edit => {
  const [action, index, initialFields, stagedFields] = edit
  const updates = stagedFields.reduce((acc, [field, value], index) => {
    const initialValue = initialFields ? initialFields[index][1] : null
    if (value !== initialValue) {
      acc[field] = value
    }
    return acc
  }, {})

  return {
    action,
    index,
    updates,
  }
}

const aliasEdits = (initial, staged) =>
  staged
    .reduce((acc, stagedAlias, stagedIndex) => {
      const edit = aliasEdit(stagedIndex, initial[stagedIndex], stagedAlias)
      if (edit === null) {
        return acc
      }
      acc.push(edit)
      return acc
    }, [])
    .map(edit => (edit[0] === CONCEPT_STATE.ALIAS.DELETE ? deleteAlias(edit) : editAlias(edit)))

const orderedAliases = aliases => {
  const capNameTypes = aliases.map(alias => ({ ...alias, nameType: capitalize(alias.nameType) }))
  return ALIAS_TYPES.flatMap(type => sortedType(capNameTypes, type))
}

const sortedType = (aliases, type) =>
  aliases.filter(alias => alias.nameType === type).sort((a, b) => a.name.localeCompare(b.name))

export { ALIAS_TYPES, aliasBorder, aliasEdits, NAME_TYPES, orderedAliases }
