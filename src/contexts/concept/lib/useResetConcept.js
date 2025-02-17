import { CONCEPT } from '@/contexts/concept/lib/conceptStateReducer'

const MEDIA_TYPES = [CONCEPT.RESET_MEDIA, CONCEPT.RESET_MEDIA_ITEM]
export const RESET_TYPES = [CONCEPT.RESET_FIELD, CONCEPT.RESET_MEDIA, CONCEPT.RESET_MEDIA_ITEM]

const resetConceptField = (action, dispatch, initialState) => {
  const resetFieldValue = field => {
    dispatch({
      type: CONCEPT.RESET_FIELD,
      update: { field, value: initialState[field] },
    })
  }

  // Certain field resets are done in tandem.
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
    case CONCEPT.RESET_MEDIA:
      dispatch({
        type: CONCEPT.RESET_MEDIA,
        update: { media: initialState.media },
      })
      break

    case CONCEPT.RESET_MEDIA_ITEM: {
      const { mediaIndex } = action.update
      dispatch({
        type: CONCEPT.RESET_MEDIA_ITEM,
        update: { mediaIndex, mediaItem: initialState.media[mediaIndex] },
      })
      break
    }

    default:
      break
  }
}

const useResetConcept = (dispatch, initialState) => action => {
  const resetFn = MEDIA_TYPES.includes(action.type) ? resetConceptMedia : resetConceptField
  resetFn(action, dispatch, initialState)
}

export default useResetConcept
