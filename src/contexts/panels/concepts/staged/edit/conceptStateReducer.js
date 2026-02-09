import { addAlias, deleteAlias, editAlias, resetAliases } from '@/lib/concept/state/aliases'
import { editAuthor, resetAuthor } from '@/lib/concept/state/author'
import { addChild, resetChild, resetChildren } from '@/lib/concept/state/children'
import { addMedia, deleteMedia, editMedia, resetMedia } from '@/lib/concept/state/media'
import { editName, resetName } from '@/lib/concept/state/name'
import { editParent, resetParent } from '@/lib/concept/state/parent'
import { editRank, resetRank } from '@/lib/concept/state/rank'
import {
  addRealization,
  deleteRealization,
  editRealization,
  resetRealizations,
} from '@/lib/concept/state/realizations'
import { editValue } from '@/lib/concept/state/value'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { ALIAS, AUTHOR, CHILD, MEDIA_ITEM, NAME, PARENT, RANK, REALIZATION, RESET } = CONCEPT_STATE

const conceptStateReducer = (stagedState, { type, update, initialState }) => {
  const params = { initialState, stagedState, update }
  switch (type) {
    case CONCEPT_STATE.INITIAL:
      return update

    case ALIAS.ADD:
      return addAlias(params)

    case ALIAS.DELETE:
      return deleteAlias(params)

    case ALIAS.EDIT:
      return editAlias(params)

    case AUTHOR:
      return editAuthor(params)

    case CHILD.ADD:
      return addChild(params)

    case MEDIA_ITEM.ADD:
      return addMedia(params)

    case MEDIA_ITEM.DELETE:
      return deleteMedia(params)

    case MEDIA_ITEM.EDIT:
      return editMedia(params)

    case MEDIA_ITEM.INDEX:
      return editValue(params)

    case NAME:
      return editName(params)

    case PARENT:
      return editParent(params)

    case RANK:
      return editRank(params)

    case REALIZATION.ADD:
      return addRealization(params)

    case REALIZATION.DELETE:
      return deleteRealization(params)

    case REALIZATION.EDIT:
      return editRealization(params)

    case RESET.ALIASES:
      return resetAliases(params)

    case RESET.AUTHOR:
      return resetAuthor(params)

    case RESET.CHILD:
      return resetChild(params)

    case RESET.CHILDREN:
      return resetChildren(params)

    case RESET.MEDIA:
      return resetMedia(params)

    case RESET.NAME:
      return resetName(params)

    case RESET.PARENT:
      return resetParent(params)

    case RESET.RANK:
      return resetRank(params)

    case RESET.REALIZATIONS:
      return resetRealizations(params)

    default:
      return stagedState
  }
}

export default conceptStateReducer
