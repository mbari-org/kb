import { addAlias, deleteAlias, editAlias } from '@/lib/kb/concept/state/aliases'
import { resetField, setField } from '@/lib/kb/concept/state/field'
import {
  addMedia,
  deleteMedia,
  editMedia,
  resetMedia,
  resetMediaItem,
} from '@/lib/kb/concept/state/media'
import { changeName, changeParent } from '@/lib/kb/concept/state/structure'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const conceptStateReducer = (state, { type, update }) => {
  switch (type) {
    case CONCEPT_STATE.INITIAL:
      return update

    case CONCEPT_STATE.ALIAS.ADD:
      return addAlias(state, update)

    case CONCEPT_STATE.ALIAS.DELETE:
      return deleteAlias(state, update)

    case CONCEPT_STATE.ALIAS.EDIT:
      return editAlias(state, update)

    case CONCEPT_STATE.FIELD.SET:
      return setField(state, update)

    case CONCEPT_STATE.MEDIA.ADD:
      return addMedia(state, update)

    case CONCEPT_STATE.MEDIA.DELETE:
      return deleteMedia(state, update)

    case CONCEPT_STATE.MEDIA.EDIT:
      return editMedia(state, update)

    case CONCEPT_STATE.RESET.FIELD:
      return resetField(state, update)

    case CONCEPT_STATE.RESET.MEDIA:
      return resetMedia(state, update)

    case CONCEPT_STATE.RESET.MEDIA_ITEM:
      return resetMediaItem(state, update)

    case CONCEPT_STATE.STRUCTURE.NAME_CHANGE:
      return changeName(state, update)

    case CONCEPT_STATE.STRUCTURE.PARENT_UPDATE:
      return changeParent(state, update)

    default:
      return state
  }
}

export { conceptStateReducer }
