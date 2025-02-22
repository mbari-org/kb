import { aliasesState } from '@/lib/kb/concept/state/aliases'
import { mediaState } from '@/lib/kb/concept/state/media'
import { rankState } from '@/lib/kb/concept/state/rank'

const CONCEPT_STATE = {
  ALIAS_ADD: 'Alias Add',
  ALIAS_DELETE: 'Alias Delete',
  ALIAS_EDIT: 'Alias Edit',
  INIT_STATE: 'Init State',
  MEDIA_ADD: 'Media Add',
  MEDIA_DELETE: 'Media Delete',
  MEDIA_EDIT: 'Media Edit',
  NAME_CHANGE: 'Name Change',
  NO_ACTION: 'No Action',
  PARENT_UPDATE: 'Parent Update',
  RESET_FIELD: 'Reset Field',
  RESET_MEDIA: 'Reset Media',
  RESET_MEDIA_ITEM: 'Reset Media Item',
  SET_FIELD: 'Set Field',
}

const conceptState = concept => {
  return {
    ...aliasesState(concept),
    author: concept.author || 'unknown',
    ...mediaState(concept),
    name: concept.name,
    parentName: concept.parent?.name,
    ...rankState(concept),
  }
}

export { CONCEPT_STATE, conceptState }
