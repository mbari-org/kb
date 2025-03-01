import { aliasesState } from '@/lib/kb/concept/state/aliases'
import { fieldState } from '@/lib/kb/concept/state/field'
import { mediaState } from '@/lib/kb/concept/state/media'
import { structureState } from '@/lib/kb/concept/state/structure'

const CONCEPT_STATE = {
  ALIAS: {
    ADD: 'Alias Add',
    DELETE: 'Alias Delete',
    EDIT: 'Alias Edit',
  },
  FIELD: {
    SET: 'Field Set',
  },
  INITIAL: 'Initial State',
  MEDIA: {
    ADD: 'Media Add',
    DELETE: 'Media Delete',
    EDIT: 'Media Edit',
  },
  NO_ACTION: 'None',
  RESET: {
    CONFIRMED: {
      NO: 'Discard Reset',
      YES: 'Perform Reset',
    },
    ALIAS: 'Reset Alias',
    ALIASES: 'Reset Aliases',
    FIELD: 'Reset Field',
    MEDIA: 'Reset Media',
    MEDIA_ITEM: 'Reset Media Item',
    TO_INITIAL: 'Reset To Initial',
  },
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
