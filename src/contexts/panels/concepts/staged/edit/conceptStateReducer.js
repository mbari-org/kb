import { addAlias, deleteAlias, editAlias, resetAlias, resetAliases } from '@/lib/kb/state/aliases'

import { resetField, setField } from '@/lib/kb/state/field'

import { addMedia, deleteMedia, editMedia, resetMedia, resetMediaItem } from '@/lib/kb/state/media'

import {
  addRealization,
  deleteRealization,
  editRealization,
  resetRealization,
  resetRealizations,
} from '@/lib/kb/state/realizations'

import {
  addChild,
  changeName,
  changeParent,
  resetAddChild,
  resetAddChildren,
  resetChangeName,
  resetChangeParent,
} from '@/lib/kb/state/structure'

import { CONCEPT_STATE } from '@/lib/constants'

const { ALIAS, FIELD, MEDIA, REALIZATION, RESET, STRUCTURE } = CONCEPT_STATE

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

    case FIELD.SET:
      return setField(state, update)

    case MEDIA.ADD:
      return addMedia(state, update)

    case MEDIA.DELETE:
      return deleteMedia(state, update)

    case MEDIA.EDIT:
      return editMedia(state, update)

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

    case RESET.ALIAS_ITEM:
      return resetAlias(state, update)

    case RESET.ALIASES:
      return resetAliases(state, update)

    case RESET.CHANGE_NAME:
      return resetChangeName(state, update)

    case RESET.CHANGE_PARENT:
      return resetChangeParent(state, update)

    case RESET.FIELD:
      return resetField(state, update)

    case RESET.MEDIA:
      return resetMedia(state, update)

    case RESET.MEDIA_ITEM:
      return resetMediaItem(state, update)

    case RESET.REALIZATION_ITEM:
      return resetRealization(state, update)

    case RESET.REALIZATIONS:
      return resetRealizations(state, update)

    case STRUCTURE.ADD_CHILD:
      return addChild(state, update)

    case STRUCTURE.CHANGE_NAME:
      return changeName(state, update)

    case STRUCTURE.CHANGE_PARENT:
      return changeParent(state, update)

    default:
      return state
  }
}

export default conceptStateReducer
