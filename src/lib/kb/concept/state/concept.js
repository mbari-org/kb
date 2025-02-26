import { aliasesState } from '@/lib/kb/concept/state/aliases'
import { mediaState } from '@/lib/kb/concept/state/media'
import { rankState } from '@/lib/kb/concept/state/rank'

const CONCEPT_STATE = {
  ALIAS: {
    ADD: 'Alias Add',
    DELETE: 'Alias Delete',
    EDIT: 'Alias Edit',
  },
  INITIAL: 'Initial State',
  MEDIA: {
    ADD: 'Media Add',
    DELETE: 'Media Delete',
    EDIT: 'Media Edit',
  },
  NAME_CHANGE: 'Name Change',
  NO_ACTION: 'None',
  PARENT_UPDATE: 'Parent Update',
  RESET: {
    ALIAS: 'Reset Alias',
    ALIASES: 'Reset Aliases',
    FIELD: 'Reset Field',
    MEDIA: 'Reset Media',
    MEDIA_ITEM: 'Reset Media Item',
  },
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
