import { stagedEdits } from '@/lib/kb/state/staged'

import { CONCEPT_STATE } from '@/lib/constants'

const CHILD_FIELDS = ['author', 'name', 'rankName', 'rankLevel']

const EMPTY_CHILD = {
  author: '',
  name: '',
  rankName: '',
  rankLevel: '',
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

export { EMPTY_CHILD, stagedChildren }
