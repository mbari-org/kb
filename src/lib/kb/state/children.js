import { CONCEPT_STATE } from '@/lib/constants'
import { CHILD_FIELDS } from '@/lib/kb/model/children'
import { stagedEdits } from '@/lib/kb/state/staged'

const addChild = (state, update) => {
  return {
    ...state,
    children: [...state.children, update.child],
  }
}

const resetChildren = (state, update) => {
  const { index: resetIndex } = update

  if (1 < state.children.length && resetIndex !== undefined) {
    const child = update.children[resetIndex]
    return {
      ...state,
      children: state.children.map(item => (item.name === child.name ? child : item)),
    }
  }
  return {
    ...state,
    children: update.children,
  }
}

const stagedChildren = stagedEdit => {
  const [_field, children] = stagedEdit

  return stagedEdits({
    displayFields: CHILD_FIELDS,
    initial: children.initial,
    staged: children.staged,
    stateTypes: [CONCEPT_STATE.CHILD.ADD],
  })
}

export { addChild, resetChildren, stagedChildren }
