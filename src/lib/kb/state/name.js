import { CONCEPT_STATE } from '@/lib/constants'

const nameState = (concept, pending) => {
  // const name = stagedName(concept, pending)

  console.log('CxInc use pending for staged name state', pending)

  return {
    name: {
      action: CONCEPT_STATE.NO_ACTION,
      value: concept.name,
      extent: '',
    },
  }
}

const editName = (state, update) => {
  return {
    ...state,
    name: update,
  }
}

const resetName = (state, update) => {
  return {
    ...state,
    name: update.name,
  }
}

export { editName, nameState, resetName }
