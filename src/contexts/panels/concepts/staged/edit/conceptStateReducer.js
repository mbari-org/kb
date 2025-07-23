import { addAlias, deleteAlias, editAlias, resetAlias, resetAliases } from '@/lib/kb/state/aliases'
import { editAuthor, resetAuthor } from '@/lib/kb/state/author'
import { addMedia, deleteMedia, editMedia, resetMedia, resetMediaItem } from '@/lib/kb/state/media'
import { editRank, resetRank } from '@/lib/kb/state/rank'
import {
  addRealization,
  deleteRealization,
  editRealization,
  resetRealization,
  resetRealizations,
} from '@/lib/kb/state/realizations'
import { addChild, resetAddChild, resetAddChildren, setStructure } from '@/lib/kb/state/structure'

import { CONCEPT_STATE } from '@/lib/constants'

const { ALIAS, AUTHOR, CONCEPT, MEDIA, RANK, REALIZATION, RESET } = CONCEPT_STATE

const conceptStateReducer = (state, { type, update }) => {
  switch (type) {
    case CONCEPT_STATE.INITIAL:
      return update

    case ALIAS.ADD:
      return addAlias(state, update)

    case ALIAS.DELETE:
      return deleteAlias(state, update)

    case ALIAS.EDIT:
      return editAlias(state, update)

    case AUTHOR:
      return editAuthor(state, update)

    case CONCEPT.ADD_CHILD:
      return addChild(state, update)

    case CONCEPT.STRUCTURE:
      return setStructure(state, update)

    case MEDIA.ADD:
      return addMedia(state, update)

    case MEDIA.DELETE:
      return deleteMedia(state, update)

    case MEDIA.EDIT:
      return editMedia(state, update)

    case RANK:
      return editRank(state, update)

    case REALIZATION.ADD:
      return addRealization(state, update)

    case REALIZATION.DELETE:
      return deleteRealization(state, update)

    case REALIZATION.EDIT:
      return editRealization(state, update)

    case RESET.ADD_CHILD:
      return resetAddChild(state, update)

    case RESET.ADD_CHILDREN:
      return resetAddChildren(state)

    case RESET.ALIAS:
      return resetAlias(state, update)

    case RESET.AUTHOR:
      return resetAuthor(state, update)

    case RESET.GROUP.ALIASES:
      return resetAliases(state, update)

    case RESET.GROUP.MEDIA:
      return resetMedia(state, update)

    case RESET.GROUP.REALIZATIONS:
      return resetRealizations(state, update)

    case RESET.MEDIA:
      return resetMediaItem(state, update)

    case RESET.RANK:
      return resetRank(state, update)

    case RESET.REALIZATION:
      return resetRealization(state, update)

    case RESET.STRUCTURE:
      return setStructure(state, update)

    default:
      return state
  }
}

export default conceptStateReducer
