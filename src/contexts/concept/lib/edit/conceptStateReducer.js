import {
  addAlias,
  deleteAlias,
  editAlias,
  resetAlias,
  resetAliases,
} from '@/lib/kb/conceptState/aliases'

import { resetField, setField } from '@/lib/kb/conceptState/field'

import {
  addMedia,
  deleteMedia,
  editMedia,
  resetMedia,
  resetMediaItem,
} from '@/lib/kb/conceptState/media'

import {
  addChild,
  changeName,
  changeParent,
  resetAddChild,
  resetAddChildren,
  resetChangeName,
  resetChangeParent,
} from '@/lib/kb/conceptState/structure'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const { ALIAS, FIELD, MEDIA, RESET, STRUCTURE } = CONCEPT_STATE

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

    case RESET.ADD_CHILD:
      return resetAddChild(state, update)

    case RESET.ADD_CHILDREN:
      return resetAddChildren(state)

    case RESET.ALIAS:
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
