import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'

const RESET_TYPES = [
  CONCEPT_STATE.ALIAS.RESET,
  CONCEPT_STATE.ALIAS.RESET_ALL,
  CONCEPT_STATE.FIELD.RESET,
  CONCEPT_STATE.MEDIA.RESET,
  CONCEPT_STATE.MEDIA.RESET_ITEM,
]

const isResetAction = action => RESET_TYPES.includes(action.type)

const resetAlias = (action, dispatch, initialState) => {
  switch (action.type) {
    case CONCEPT_STATE.ALIAS.RESET:
      dispatch({ type: CONCEPT_STATE.ALIAS.RESET, update: { aliases: initialState.aliases } })
      break
  }
}

const resetField = (action, dispatch, initialState) => {
  const resetFieldValue = field => {
    dispatch({
      type: CONCEPT_STATE.FIELD.RESET,
      update: { field, value: initialState[field] },
    })
  }

  // Certain field resets are grouped together.
  switch (action.field) {
    case 'name':
    case 'nameUpdate':
      resetFieldValue('name')
      resetFieldValue('nameUpdate')
      break

    case 'rankLevel':
    case 'rankName':
      resetFieldValue('rankLevel')
      resetFieldValue('rankName')
      break

    default:
      resetFieldValue(action.field)
      break
  }
}

const resetMedia = (action, dispatch, initialState) => {
  switch (action.type) {
    case CONCEPT_STATE.MEDIA.RESET:
      dispatch({
        type: CONCEPT_STATE.MEDIA.RESET,
        update: { media: initialState.media },
      })
      break

    case CONCEPT_STATE.MEDIA.RESET_ITEM: {
      const { mediaIndex } = action.update
      dispatch({
        type: CONCEPT_STATE.MEDIA.RESET_ITEM,
        update: { mediaIndex, mediaItem: initialState.media[mediaIndex] },
      })
      break
    }

    default:
      break
  }
}

const reset = (action, dispatch, initialState) => {
  switch (action.type) {
    case CONCEPT_STATE.ALIAS.RESET:
      resetAlias(action, dispatch, initialState)
      break

    case CONCEPT_STATE.FIELD.RESET:
      resetField(action, dispatch, initialState)
      break

    case CONCEPT_STATE.MEDIA.RESET:
      resetMedia(action, dispatch, initialState)
      break

    default:
      break
  }
}

const resetEditingState = (dispatch, initialState, data, setData) => action => {
  if (data?.confirmResetFn) {
    data.confirmResetFn()
    return
  }

  const confirmResetFn = () => reset(action, dispatch, initialState)

  console.log('resetEditingState', { confirmResetFn })
  setData({ confirmResetFn })
}

export { isResetAction, resetEditingState }
