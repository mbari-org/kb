import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

const deleteItem = edit => {
  const { action, index } = edit
  return {
    action,
    index,
    updates: {},
  }
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

const fieldBorder = ({ itemPendingHistory, noActionBorderColor, stagedItem, theme, width }) => {
  const itemAction =
    stagedItem?.action !== CONCEPT_STATE.NO_ACTION
      ? stagedItem.action.split(' ')[1].toUpperCase()
      : itemPendingHistory?.action
      ? itemPendingHistory.action
      : null

  // const borderWidth = stagedItem?.action === CONCEPT_STATE.NO_ACTION ? '1px' : width
  let borderColor, borderWidth
  switch (itemAction) {
    case 'ADD':
      borderColor = theme.palette.primary.add
      borderWidth = width
      break

    case 'EDIT':
      borderColor = theme.palette.primary.edit
      borderWidth = width
      break

    case 'DELETE':
      borderColor = theme.palette.primary.remove
      borderWidth = width
      break

    default:
      borderColor = noActionBorderColor
      borderWidth = '1px'
  }
  return `${borderWidth} solid ${borderColor}`
}

const fieldEdits = ({ stateType, displayFields, initial, staged }) =>
  staged
    .reduce((acc, item, index) => {
      const edit = itemEdit(stateType, index, initial[index], item, displayFields)
      if (edit === null) {
        return acc
      }
      acc.push(edit)
      return acc
    }, [])
    .map(edit => (edit.action === stateType.DELETE ? deleteItem(edit) : editItem(edit)))

const itemEdit = (stateType, index, initialItem, stagedItem, displayFields) => {
  const { action } = stagedItem

  if (action === CONCEPT_STATE.NO_ACTION) {
    return null
  }

  const initial = action === stateType.ADD ? null : displayItem(initialItem, displayFields)
  const staged = action === stateType.DELETE ? null : displayItem(stagedItem, displayFields)

  return { action, index, initial, staged }
}

export { deleteItem, displayItem, editItem, fieldBorder, fieldEdits, itemEdit }
