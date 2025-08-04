import { ACTION, CONCEPT_STATE } from '@/lib/constants'
import { CHILD_FIELDS } from '@/lib/kb/model/children'

import { fieldPending } from '@/lib/kb/model/history'
import { stagedEdits } from '@/lib/kb/state/staged'

const addChild = (state, update) => {
  const childIndex = state.children.length
  const childItem = {
    ...update.child,
    action: CONCEPT_STATE.CHILD.ADD,
    index: childIndex,
  }
  return {
    ...state,
    children: [...state.children, childItem],
  }
}

const childrenState = (concept, pending) => {
  const { children } = concept
  const stagedChildren = children.map((childName, index) =>
    stagedChild({ name: childName, action: CONCEPT_STATE.NO_ACTION, index }, pending)
  )
  return { children: stagedChildren }
}

const resetChildren = (state, update) => {
  const { index: resetIndex } = update

  if (1 < state.children.length && resetIndex !== undefined) {
    const child = update.children[resetIndex]
    return {
      ...state,
      children: state.children.reduce((acc, item, index) => {
        index === resetIndex ? child != null && acc.push(child) : acc.push(item)
        return acc
      }, []),
    }
  }
  return {
    ...state,
    children: update.children,
  }
}

const stagedChild = (child, pendingConcept) => {
  const pendingChildActions = fieldPending(pendingConcept, 'ConceptName')

  const pendingAdd = pendingChildActions.find(
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

export { addChild, childrenState, resetChildren, stagedChildren }
