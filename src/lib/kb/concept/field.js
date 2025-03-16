import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

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

const fieldBorder = (stateType, fieldItem, theme, width, none) => {
  const borderWidth = fieldItem?.action === CONCEPT_STATE.NO_ACTION ? '1px' : width
  let borderColor
  switch (fieldItem?.action) {
    case stateType.ADD:
      borderColor = theme.palette.primary.add
      break

    case stateType.EDIT:
      borderColor = theme.palette.primary.edit
      break

    case stateType.DELETE:
      borderColor = theme.palette.primary.remove
      break

    default:
      borderColor = none
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
    .map(edit => (edit[0] === stateType.DELETE ? deleteItem(edit) : editItem(edit)))

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
