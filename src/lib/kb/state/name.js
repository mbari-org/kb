import { fieldPending } from '@/lib/kb/model/history'

import { CONCEPT_STATE } from '@/lib/constants'

const nameState = (concept, pendingConcept) => {
  const { name } = concept

  const stateName = {
    action: CONCEPT_STATE.NO_ACTION,
    value: name,
    extent: '',
  }

  return stagedName(stateName, pendingConcept)
}

const editName = (state, update) => {
  return {
    ...state,
    name: update,
  }
}

const isPendingName = pendingChange =>
  pendingChange.field === 'ConceptName' &&
  pendingChange.action === 'REPLACE' &&
  pendingChange.concept === pendingChange.newValue

const resetName = (state, update) => {
  return {
    ...state,
    name: update.name,
  }
}

const stagedName = (stateName, pendingConcept) => {
  const pendingNames = fieldPending(pendingConcept, 'ConceptName')
  const pendingReplace = pendingNames.find(pending => pending.action === 'REPLACE')
  if (!pendingReplace) return { name: stateName }

  return {
    name: {
      ...stateName,
      action: 'Pending Edit',
      historyId: pendingReplace.id,
      value: pendingReplace.value,
      extent: pendingReplace.extent,
    },
  }
}

export { editName, isPendingName, nameState, resetName }
