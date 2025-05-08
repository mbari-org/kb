import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'
const RESET = CONCEPT_STATE.RESET

const RESET_ACTIONS = [
  RESET.ADD_CHILD,
  RESET.ADD_CHILDREN,
  RESET.ALIAS,
  RESET.ALIASES,
  RESET.CHANGE_NAME,
  RESET.CHANGE_PARENT,
  RESET.DELETE_CONCEPT,
  RESET.FIELD,
  RESET.MEDIA,
  RESET.MEDIA_ITEM,
  RESET.TO_INITIAL,
]

const isResetAction = action => RESET_ACTIONS.includes(action.type)

const resetAlias = (aliasIndex, dispatch, initialState) => {
  dispatch({
    type: RESET.ALIAS,
    update: { alias: initialState.aliases[aliasIndex], aliasIndex },
  })
}

const resetAliases = (dispatch, initialState) => {
  dispatch({
    type: RESET.ALIASES,
    update: { aliases: initialState.aliases },
  })
}

const resetAddChild = (dispatch, child) => {
  dispatch({
    type: RESET.ADD_CHILD,
    update: { child },
  })
}

const resetAddChildren = dispatch => {
  dispatch({
    type: RESET.ADD_CHILDREN,
  })
}

const resetChangeName = (dispatch, name) => {
  dispatch({
    type: RESET.CHANGE_NAME,
    update: { name },
  })
}

const resetChangeParent = (dispatch, parent) => {
  dispatch({
    type: RESET.CHANGE_PARENT,
    update: { parent },
  })
}

const resetDeleteConcept = (dispatch, concept) => {
  dispatch({
    type: RESET.DELETE_CONCEPT,
    update: { concept },
  })
}

const resetField = (field, dispatch, initialState) => {
  const resetFieldValue = field => {
    dispatch({
      type: RESET.FIELD,
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
    type: RESET.MEDIA,
    update: { media: initialState.media },
  })
}

const resetMediaItem = (mediaIndex, dispatch, initialState) => {
  dispatch({
    type: RESET.MEDIA_ITEM,
    update: { mediaIndex, mediaItem: initialState.media[mediaIndex] },
  })
}

const resetToInitial = (dispatch, initialState) => {
  dispatch({
    type: CONCEPT_STATE.INITIAL,
    update: { ...initialState },
  })
}

const resetConceptState = (action, dispatch, initialState) => {
  switch (action.type) {
    case RESET.ALIAS:
      resetAlias(action.update.aliasIndex, dispatch, initialState)
      break

    case RESET.ALIASES:
      resetAliases(dispatch, initialState)
      break

    case RESET.ADD_CHILD:
      resetAddChild(dispatch, action.update.child)
      break

    case RESET.ADD_CHILDREN:
      resetAddChildren(dispatch)
      break

    case RESET.CHANGE_NAME:
      resetChangeName(dispatch, action.update.name)
      break

    case RESET.CHANGE_PARENT:
      resetChangeParent(dispatch, action.update.parent)
      break

    case RESET.DELETE_CONCEPT:
      resetDeleteConcept(dispatch, action.update.concept)
      break

    case RESET.FIELD:
      resetField(action.update.field, dispatch, initialState)
      break

    case RESET.MEDIA:
      resetMedia(dispatch, initialState)
      break

    case RESET.MEDIA_ITEM:
      resetMediaItem(action.update.mediaIndex, dispatch, initialState)
      break

    case RESET.TO_INITIAL:
      resetToInitial(dispatch, initialState)
      break

    default:
      break
  }
}

export { isResetAction, resetConceptState }
