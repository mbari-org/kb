import { addAlias, deleteAlias, editAlias, resetAliases } from '@/lib/kb/state/aliases'
import { editAuthor, resetAuthor } from '@/lib/kb/state/author'
import { addChild, resetChild, resetChildren } from '@/lib/kb/state/children'
import { addMedia, deleteMedia, editMedia, resetMedia } from '@/lib/kb/state/media'
import { editName, resetName } from '@/lib/kb/state/name'
import { editParent, resetParent } from '@/lib/kb/state/parent'
import { editRank, resetRank } from '@/lib/kb/state/rank'
import {
  addRealization,
  deleteRealization,
  editRealization,
  resetRealizations,
} from '@/lib/kb/state/realizations'
import { editValue } from '@/lib/kb/state/value'

import { CONCEPT_STATE } from '@/lib/constants'

const { ALIAS, AUTHOR, CHILD, MEDIA_ITEM, NAME, PARENT, RANK, REALIZATION, RESET } =
  CONCEPT_STATE

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

    case CHILD.ADD:
      return addChild(state, update)

    case MEDIA_ITEM.ADD:
      return addMedia(state, update)

    case MEDIA_ITEM.DELETE:
      return deleteMedia(state, update)

    case MEDIA_ITEM.EDIT:
      return editMedia(state, update)

    case MEDIA_ITEM.INDEX:
      return editValue(state, update)

    case NAME:
      return editName(state, update)

    case PARENT:
      return editParent(state, update)

    case RANK:
      return editRank(state, update)

    case REALIZATION.ADD:
      return addRealization(state, update)

    case REALIZATION.DELETE:
      return deleteRealization(state, update)

    case REALIZATION.EDIT:
      return editRealization(state, update)

    case RESET.ALIASES:
      return resetAliases(state, update)

    case RESET.AUTHOR:
      return resetAuthor(state, update)

    case RESET.CHILD:
      return resetChild(state, update)

    case RESET.CHILDREN:
      return resetChildren(state, update)

    case RESET.MEDIA:
      return resetMedia(state, update)

    case RESET.NAME:
      return resetName(state, update)

    case RESET.PARENT:
      return resetParent(state, update)

    case RESET.RANK:
      return resetRank(state, update)

    case RESET.REALIZATIONS:
      return resetRealizations(state, update)

    default:
      return state
  }
}

export default conceptStateReducer
