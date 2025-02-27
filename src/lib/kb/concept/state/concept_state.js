import { aliasesState } from '@/lib/kb/concept/state/aliases'
import { fieldState } from '@/lib/kb/concept/state/field'
import { mediaState } from '@/lib/kb/concept/state/media'
import { structureState } from '@/lib/kb/concept/state/structure'

const CONCEPT_STATE = {
  ALIAS: {
    ADD: 'Alias Add',
    DELETE: 'Alias Delete',
    EDIT: 'Alias Edit',
    RESET: 'Alias Reset',
    RESET_ALL: 'Alias Reset All',
  },
  FIELD: {
    RESET: 'Reset Field',
    SET: 'Set Field',
  },
  INITIAL: 'Initial State',
  MEDIA: {
    ADD: 'Media Add',
    DELETE: 'Media Delete',
    EDIT: 'Media Edit',
    RESET: 'Reset Media',
    RESET_ITEM: 'Reset Media Item',
  },
  NO_ACTION: 'None',
  STRUCTURE: {
    NAME_CHANGE: 'Name Change',
    PARENT_UPDATE: 'Parent Update',
  },
}

const conceptState = concept => {
  return {
    ...aliasesState(concept),
    ...fieldState(concept),
    ...mediaState(concept),
    ...structureState(concept),
  }
}

export { CONCEPT_STATE, conceptState }
