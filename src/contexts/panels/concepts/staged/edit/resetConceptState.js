import { CONCEPT_STATE } from '@/lib/constants'
const RESET = CONCEPT_STATE.RESET

const stringValues = o => {
  return Object.values(o).flatMap(v =>
    typeof v === 'string' ? v : typeof v === 'object' && v !== null ? stringValues(v) : []
  )
}
const RESET_ACTIONS = stringValues(RESET)

const isResetAction = action => RESET_ACTIONS.includes(action.type)

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

const resetAliases = (dispatch, aliases, index) => {
  const update = index !== undefined ? { aliases, index } : { aliases }
  dispatch({
    type: RESET.GROUP.ALIASES,
    update,
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
    type: RESET.MEDIA,
    update: { mediaIndex, mediaItem: initialState.media[mediaIndex] },
  })
}

const resetRank = (dispatch, initialState) => {
  dispatch({
    type: RESET.RANK,
    update: { rank: initialState.rank },
  })
}

const resetRealizationItem = (realizationIndex, dispatch, initialState) => {
  dispatch({
    type: RESET.REALIZATION,
    update: { realizationIndex, realizationItem: initialState.realizations[realizationIndex] },
  })
}

const resetRealizations = (dispatch, initialState) => {
  dispatch({
    type: RESET.GROUP.REALIZATIONS,
    update: { realizations: initialState.realizations },
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
    // case RESET.ALIAS:
    //   {
    //     const aliasIndex = action.update.index
    //     dispatch({
    //       type: RESET.ALIAS,
    //       update: { aliasIndex, aliasItem: initialState.aliases[aliasIndex] },
    //     })
    //   }
    //   break

    case RESET.ADD_CHILD:
      resetAddChild(dispatch, action.update.child)
      break

    case RESET.ADD_CHILDREN:
      resetAddChildren(dispatch)
      break

    case RESET.AUTHOR:
      dispatch({
        type: RESET.AUTHOR,
        update: { author: initialState.author },
      })
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

    case RESET.GROUP.ALIASES:
      dispatch({
        type: RESET.GROUP.ALIASES,
        update: { aliases: initialState.aliases, index: action.update.index },
      })
      break

    case RESET.GROUP.RANK:
      resetRank(dispatch, initialState)
      break

    case RESET.GROUP.MEDIA:
      resetMedia(dispatch, initialState)
      break

    case RESET.GROUP.REALIZATIONS:
      resetRealizations(dispatch, initialState)
      break

    case RESET.MEDIA:
      resetMediaItem(action.update.groupIndex, dispatch, initialState)
      break

    case RESET.REALIZATION:
      resetRealizationItem(action.update.groupIndex, dispatch, initialState)
      break

    case RESET.TO_INITIAL:
      resetToInitial(dispatch, initialState)
      break

    default:
      break
  }
}

export { isResetAction, resetConceptState }
