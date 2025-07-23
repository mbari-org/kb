import { isStagedAction } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE } from '@/lib/constants'

const deleteItem = edit => {
  return { ...edit, updates: {} }
}

const displayItem = (item, fields) => {
  return fields.reduce((fields, field) => {
    fields.push([field, item[field]])
    return fields
  }, [])
}

const editItem = edit => {
  const { action, index, initial, staged } = edit
  const updates = staged.reduce((acc, [field, value], index) => {
    const initialValue = initial ? initial[index][1] : null
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

const stagedBorder = ({ noActionBorderColor, stagedItem, theme, width }) => {
  const itemAction =
    stagedItem?.action !== CONCEPT_STATE.NO_ACTION
      ? stagedItem?.action.split(' ')[1].toUpperCase()
      : null

  const borderStyle = stagedItem?.historyId ? 'solid' : 'dashed'
  const borderWidth = itemAction ? width : '1px'

  let borderColor
  switch (itemAction) {
    case 'ADD':
      borderColor = theme.palette.primary.add
      break

    case 'EDIT':
      borderColor = theme.palette.primary.edit
      break

    case 'DELETE':
      borderColor = theme.palette.primary.remove
      break

    default:
      borderColor = noActionBorderColor
  }
  return `${borderWidth} ${borderStyle} ${borderColor}`
}

const stagedEdits = ({ displayFields, initial, staged, stateTypes }) =>
  staged
    .reduce((acc, item, index) => {
      const edit = itemEdit(stateTypes, index, initial[index], item, displayFields)
      if (edit === null) return acc
      acc.push(edit)
      return acc
    }, [])
    .map(edit => (edit.action === stateTypes.DELETE ? deleteItem(edit) : editItem(edit)))

const itemEdit = (stateTypes, index, initialItem, stagedItem, displayFields) => {
  const { action } = stagedItem
  if (!isStagedAction(action)) return null

  const initial = action === stateTypes.ADD ? null : displayItem(initialItem, displayFields)
  const staged = action === stateTypes.DELETE ? null : displayItem(stagedItem, displayFields)

  return { action, index, initial, staged }
}

export { deleteItem, displayItem, editItem, stagedBorder, stagedEdits }
