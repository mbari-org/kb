import { generalStateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { stagedEdits } from '@/lib/concept/state/staged'
import { CHILD_FIELDS } from '@/lib/model/children'

import { ACTION } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

import { isJsonEqual } from '@/lib/utils'

const addChild = ({ stagedState, update }) => {
  const childIndex = stagedState.children.length
  const childItem = {
    ...update.child,
    action: CONCEPT_STATE.CHILD.ADD,
    index: childIndex,
  }
  return {
    ...stagedState,
    children: [...stagedState.children, childItem],
  }
}

const initialState = (concept, pending) => {
  const { children } = concept
  const stagedChildren = children.map((childName, index) =>
    stagedChild({ name: childName, action: CONCEPT_STATE.NO_ACTION, index }, pending)
  )
  return { children: stagedChildren }
}

const isPendingChild = pendingItem => pendingItem.field === HISTORY_FIELD.CHILD

const resetChildren = ({ stagedState, update }) => {
  const { index: resetIndex } = update

  if (1 < stagedState.children.length && resetIndex !== undefined) {
    const child = update.children[resetIndex]
    return {
      ...stagedState,
      children: stagedState.children.reduce((acc, item, index) => {
        index === resetIndex ? child != null && acc.push(child) : acc.push(item)
        return acc
      }, []),
    }
  }
  return {
    ...stagedState,
    children: update.children,
  }
}

// Reset a single child at its index, using the provided child object
const resetChild = ({ stagedState, update }) => {
  const { child } = update
  const resetIndex = child?.index
  if (resetIndex === undefined) return stagedState
  return {
    ...stagedState,
    children: stagedState.children.map((item, index) => (index === resetIndex ? child : item)),
  }
}

const stagedChild = (child, pendingConcept) => {
  const pendingChildren = pendingConcept.filter(isPendingChild)

  const pendingAdd = pendingChildren.find(
    history => history.action === ACTION.ADD && history.newValue === child.name
  )
  if (pendingAdd) {
    return {
      ...child,
      action: 'Add Pending',
      historyId: pendingAdd.id,
    }
  }

  return child
}

const stagedChildren = stagedEdit => {
  const [_field, children] = stagedEdit

  return stagedEdits({
    displayFields: CHILD_FIELDS,
    initial: children.initial,
    staged: children.staged,
    stateTypes: CONCEPT_STATE.CHILD,
  })
}

const isModified = (initial, staged) => !isJsonEqual(initial?.children, staged?.children)

const stateUpdates = (initial, staged) => generalStateUpdates('children', initial, staged)

export {
  addChild,
  initialState,
  isModified,
  isPendingChild,
  resetChild,
  resetChildren,
  stagedChildren,
  stateUpdates,
}

