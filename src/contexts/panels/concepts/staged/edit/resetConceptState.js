import { CONCEPT_STATE } from '@/constants/conceptState.js'
import { createError } from '@/lib/errors'
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
    type: RESET.CHILD,
    update: { child },
  })
}

const resetDeleteConcept = (dispatch, concept) => {
  dispatch({
    type: RESET.DELETE,
    update: { concept },
  })
}

const _resetMedia = (dispatch, initialState) => {
  dispatch({
    type: RESET.MEDIA,
    update: { media: initialState.media },
  })
}

const resetRank = (dispatch, initialState) => {
  dispatch({
    type: RESET.RANK,
    update: { rank: initialState.rank },
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
    case RESET.CHILD:
      resetAddChild(dispatch, action.update.child)
      break

    case RESET.ALIASES:
      dispatch({
        type: RESET.ALIASES,
        update: { aliases: initialState.aliases, index: action.update.index },
      })
      break

    case RESET.AUTHOR:
      dispatch({
        type: RESET.AUTHOR,
        update: { author: initialState.author },
      })
      break

    case RESET.CHILDREN:
      dispatch({
        type: RESET.CHILDREN,
        update: { children: initialState.children, index: action.update.index },
      })
      break

    case RESET.DELETE:
      resetDeleteConcept(dispatch, action.update.concept)
      break

    case RESET.MEDIA:
      dispatch({
        type: RESET.MEDIA,
        update: { media: initialState.media, index: action.update.index },
      })
      break

    case RESET.NAME:
      dispatch({
        type: RESET.NAME,
        update: { name: initialState.name },
      })
      break

    case RESET.PARENT:
      dispatch({
        type: RESET.PARENT,
        update: { parent: initialState.parent },
      })
      break

    case RESET.RANK:
      resetRank(dispatch, initialState)
      break

    case RESET.REALIZATIONS:
      dispatch({
        type: RESET.REALIZATIONS,
        update: { realizations: initialState.realizations, index: action.update.index },
      })
      break

    case RESET.TO_INITIAL:
      resetToInitial(dispatch, initialState)
      break

    default:
      throw createError(
        'Invalid Reset Action',
        `Cannot reset concept state with unknown action: ${action.type}`,
        { action }
      )
  }
}

export { isResetAction, resetConceptState }
