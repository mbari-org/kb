import { mediaState } from '@/lib/kb/concept/state/media'
import { namesState } from '@/lib/kb/concept/state/names'
import { rankState } from '@/lib/kb/concept/state/rank'

const CONCEPT_STATE = {
  INIT_STATE: 'Init State',
  MEDIA_ADD: 'Media Add',
  MEDIA_DELETE: 'Media Delete',
  MEDIA_EDIT: 'Media Edit',
  NAME_ADD: 'Name Add',
  NAME_DELETE: 'Name Delete',
  NAME_EDIT: 'Name Edit',
  NO_ACTION: 'No Action',
  PARENT_UPDATE: 'Parent Update',
  RESET_FIELD: 'Reset Field',
  RESET_MEDIA: 'Reset Media',
  RESET_MEDIA_ITEM: 'Reset Media Item',
  SET_FIELD: 'Set Field',
}

const conceptState = concept => {
  const media = mediaState(concept)
  const names = namesState(concept)
  const rank = rankState(concept)

  const conceptState = {
    author: concept.author || 'unknown',
    name: concept.name,
    parentName: concept.parent?.name,
  }

  return {
    ...conceptState,
    ...names,
    ...media,
    ...rank,
  }
}

export { CONCEPT_STATE, conceptState }
