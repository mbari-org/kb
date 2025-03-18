import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
const RESET = CONCEPT_STATE.RESET

const RESET_ACTIONS = [
  RESET.ALIAS,
  RESET.ALIASES,
  RESET.FIELD,
  RESET.MEDIA,
  RESET.MEDIA_ITEM,
  RESET.STRUCTURE.CHILD,
  RESET.STRUCTURE.CONCEPT,
  RESET.STRUCTURE.NAME,
  RESET.STRUCTURE.PARENT,
  RESET.TO_INITIAL,
]

const isResetAction = action => RESET_ACTIONS.includes(action.type)

const resetAlias = (aliasIndex, dispatch, initialState) => {
  dispatch({
    type: CONCEPT_STATE.RESET.ALIAS,
    update: { alias: initialState.aliases[aliasIndex], aliasIndex },
  })
}

const resetAliases = (dispatch, initialState) => {
  dispatch({
    type: CONCEPT_STATE.RESET.ALIASES,
    update: { aliases: initialState.aliases },
  })
}

const resetField = (field, dispatch, initialState) => {
  const resetFieldValue = field => {
    dispatch({
      type: CONCEPT_STATE.RESET.FIELD,
      update: { field, value: initialState[field] },
    })
  }

  // Certain field resets are grouped together.
  switch (field) {
    case 'name':
    case 'nameChange':
      resetFieldValue('name')
      resetFieldValue('nameChange')
      break

    case 'rankLevel':
    case 'rankName':
      resetFieldValue('rankLevel')
      resetFieldValue('rankName')
      break

    default:
      resetFieldValue(field)
      break
  }
}

const resetMedia = (dispatch, initialState) => {
  dispatch({
    type: CONCEPT_STATE.RESET.MEDIA,
    update: { media: initialState.media },
  })
}

const resetMediaItem = (mediaIndex, dispatch, initialState) => {
  dispatch({
    type: CONCEPT_STATE.RESET.MEDIA_ITEM,
    update: { mediaIndex, mediaItem: initialState.media[mediaIndex] },
  })
}

const resetStructure = (dispatch, action) => {
  dispatch({ type: action.type })
}

const resetToInitial = (dispatch, initialState) => {
  dispatch({
    type: CONCEPT_STATE.INITIAL,
    update: { ...initialState },
  })
}

const resetConceptState = (action, dispatch, initialState) => {
  switch (action.type) {
    case CONCEPT_STATE.RESET.ALIAS:
      resetAlias(action.update.aliasIndex, dispatch, initialState)
      break

    case CONCEPT_STATE.RESET.ALIASES:
      resetAliases(dispatch, initialState)
      break

    case CONCEPT_STATE.RESET.FIELD:
      resetField(action.update.field, dispatch, initialState)
      break

    case CONCEPT_STATE.RESET.MEDIA:
      resetMedia(dispatch, initialState)
      break

    case CONCEPT_STATE.RESET.MEDIA_ITEM:
      resetMediaItem(action.update.mediaIndex, dispatch, initialState)
      break

    case CONCEPT_STATE.RESET.STRUCTURE.CHILD:
      resetStructure(dispatch, action)
      break

    case CONCEPT_STATE.RESET.TO_INITIAL:
      resetToInitial(dispatch, initialState)
      break

    default:
      break
  }
}

export { isResetAction, resetConceptState }
