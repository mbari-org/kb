import { isPendingChild } from '@/lib/concept/state/children'
import { isPendingName } from '@/lib/concept/state/name'

import { ACTION } from '@/lib/constants'
import { createError } from '@/lib/errors'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { PENDING } from '@/lib/constants/pending.js'

import CONFIG from '@/lib/config'

import { capitalize, humanTimestamp, isEmpty, pick } from '@/lib/utils'

const { ITEM: itemLabel } = CONFIG.PANELS.CONCEPTS.MODALS

const hasPending = (pending, field) => (field ? !isEmpty(pendingItems(pending, field)) : !isEmpty(pending))

const pendingItems = (pendingConcept, field) => {
  if (!pendingConcept) return []

  return pendingConcept
    ?.filter(pendingItem => pendingItem.field.toLowerCase() === field.toLowerCase())
    .sort((a, b) => new Date(a.creationTimestamp) - new Date(b.creationTimestamp))
}

const pendingChild = (pendingConcept, childName) => {
  return pendingConcept?.find(
    pendingItem =>
      pendingItem.field === HISTORY_FIELD.CHILD &&
      ((pendingItem.action === ACTION.ADD && pendingItem.newValue === childName) ||
        (pendingItem.action === ACTION.DELETE && pendingItem.oldValue === childName))
  )
}

const hasPendingStructure = (pending, conceptName) => {
  const pendingConcept = pending(PENDING.DATA.CONCEPT)
  const pendingParent = pending(PENDING.DATA.PARENT)

  const hasPendingName = pendingConcept.some(isPendingName)
  const hasPendingParent = pendingParent.some(
    pendingItem =>
      pendingItem.action === ACTION.DELETE &&
      pendingItem.field === HISTORY_FIELD.CHILD &&
      pendingItem.oldValue === conceptName
  )

  const hasPendingChildren = pendingConcept.some(isPendingChild)

  const hasPendingParentChange = pendingConcept.some(
    pendingItem => pendingItem.field === HISTORY_FIELD.PARENT && pendingItem.action === ACTION.EDIT
  )

  return {
    any: hasPendingName || hasPendingChildren || hasPendingParent,
    children: hasPendingChildren,
    name: hasPendingName,
    parent: hasPendingParent,
    parentChange: hasPendingParentChange,
  }
}

const isPendingAdd = item => item.field === HISTORY_FIELD.CHILD && item.action === ACTION.ADD

const isPendingDelete = item => item.field === HISTORY_FIELD.CHILD && item.action === ACTION.DELETE

const moveAddToFirst = items => {
  const [adds, others] = items.reduce(
    ([add, rest], item) => (isPendingAdd(item) ? [[...add, item], rest] : [add, [...rest, item]]),
    [[], []]
  )
  return [...adds, ...others]
}

const moveAddToLast = items => {
  const [adds, others] = items.reduce(
    ([add, rest], item) => (isPendingAdd(item) ? [[...add, item], rest] : [add, [...rest, item]]),
    [[], []]
  )
  return [...others, ...adds]
}

const moveDeleteToLast = items => {
  const [deletes, others] = items.reduce(
    ([del, rest], item) => (isPendingDelete(item) ? [[...del, item], rest] : [del, [...rest, item]]),
    [[], []]
  )
  return [...others, ...deletes]
}

const pendingActionText = action => {
  const actionText = action !== 'REPLACE' ? action : 'Edit'
  return capitalize(actionText)
}

const pendingInfo = pendingItem => {
  return [
    ['creator', pendingItem.creatorName],
    ['created', humanTimestamp(pendingItem.creationTimestamp)],
  ]
}

const pendingValues = pendingItem =>
  pick(pendingItem, [
    ['oldValue', 'before'],
    ['newValue', 'after'],
    ['creatorName', 'user'],
    ['creationTimestamp', 'created'],
  ])

const pendingFieldLabel = pendingItem => {
  switch (pendingItem.field) {
    case HISTORY_FIELD.CHILD:
      return itemLabel.CHILD

    case HISTORY_FIELD.MEDIA:
      return itemLabel.MEDIA

    case HISTORY_FIELD.NAME:
      return isPendingName(pendingItem) ? itemLabel.NAME : itemLabel.ALIAS

    case HISTORY_FIELD.PARENT:
      return itemLabel.PARENT

    case HISTORY_FIELD.RANK:
      return itemLabel.RANK

    case HISTORY_FIELD.REALIZATION:
      return itemLabel.REALIZATION

    case HISTORY_FIELD.TEMPLATE:
      return itemLabel.TEMPLATE

    default:
      throw createError('Invalid Pending Field', `Cannot label pending item with unknown field: ${pendingItem.field}`, {
        pendingItem,
      })
  }
}

export {
  hasPending,
  hasPendingStructure,
  isPendingAdd,
  isPendingDelete,
  moveAddToFirst,
  moveAddToLast,
  moveDeleteToLast,
  pendingActionText,
  pendingChild,
  pendingFieldLabel,
  pendingInfo,
  pendingItems,
  pendingValues,
}
