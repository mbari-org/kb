import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'
const MEDIA_TYPES = [CONCEPT_STATE.MEDIA.RESET, CONCEPT_STATE.MEDIA.RESET_ITEM]
export const RESET_TYPES = [
  CONCEPT_STATE.FIELD.RESET,
  CONCEPT_STATE.MEDIA.RESET,
  CONCEPT_STATE.MEDIA.RESET_ITEM,
]

const resetConceptField = (action, dispatch, initialState) => {
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

const resetConceptMedia = (action, dispatch, initialState) => {
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

const useResetConcept = (dispatch, initialState, data, setData) => action => {
  console.log('CxINC: data', data)
  if (data?.confirmResetFn) {
    data.confirmResetFn()
    return
  }

  const resetFn = MEDIA_TYPES.includes(action.type) ? resetConceptMedia : resetConceptField
  const confirmResetFn = () => resetFn(action, dispatch, initialState)

  setData({ confirmResetFn })
}

export default useResetConcept
