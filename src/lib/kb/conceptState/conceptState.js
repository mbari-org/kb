import { aliasesState } from '@/lib/kb/conceptState/aliases'
import { fieldState } from '@/lib/kb/conceptState/field'
import { mediaState } from '@/lib/kb/conceptState/media'
import { structureState } from '@/lib/kb/conceptState/structure'

import { isEqual, isJsonEqual } from '@/lib/util'

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
    ADD_CHILD: 'Reset Add Child',
    ADD_CHILDREN: 'Reset Add Children',
    ALIAS: 'Reset Alias',
    ALIASES: 'Reset Aliases',
    CHANGE_NAME: 'Reset Change Name',
    CHANGE_PARENT: 'Reset Change Parent',
    DELETE_CONCEPT: 'Reset Delete Concept',
    FIELD: 'Reset Field',
    MEDIA: 'Reset Media',
    MEDIA_ITEM: 'Reset Media Item',
    TO_INITIAL: 'Reset To Initial',
  },
  STRUCTURE: {
    ADD_CHILD: 'Add Child',
    CHANGE_NAME: 'Change Name',
    CHANGE_PARENT: 'Change Parent',
    DELETE_CONCEPT: 'Delete Concept',
  },
}

export const FIELDS = {
  ALIASES: 'aliases',
  MEDIA: 'media',
  PARENT: 'parent',
  PRIMARY: {
    NAME: 'name',
    AUTHOR: 'author',
  },
  RANK: {
    NAME: 'name',
    LEVEL: 'level',
  },
  STRUCTURE: {
    CHILD: 'child',
    CONCEPT: 'concept',
    NAME: 'name',
    PARENT: 'parent',
  },
}

const isStateModified = (stagedState, initialState, field, index) => {
  switch (field) {
    case FIELDS.ALIASES: {
      const editingAlias = stagedState.aliases[index]
      const initialAlias = initialState.aliases[index]
      return !isEqual(editingAlias, initialAlias)
    }
    case FIELDS.MEDIA: {
      const editingMediaItem = stagedState.media[index]
      const initialMediaItem = initialState.media[index]
      return !isEqual(editingMediaItem, initialMediaItem)
    }

    case FIELDS.PARENT: {
      const editingParent = stagedState.parent
      const initialParent = initialState.parent
      return editingParent !== initialParent
    }

    case FIELDS.PRIMARY.NAME: {
      const editingName = stagedState.primary.name
      const initialName = initialState.primary.name
      return editingName !== initialName
    }

    case FIELDS.PRIMARY.AUTHOR: {
      const editingAuthor = stagedState.primary.author
      const initialAuthor = initialState.primary.author
      return editingAuthor !== initialAuthor
    }

    case FIELDS.RANK.NAME: {
      const editingRankName = stagedState.rank.name
      const initialRankName = initialState.rank.name
      return editingRankName !== initialRankName
    }

    case FIELDS.RANK.LEVEL: {
      const editingRankLevel = stagedState.rank.level
      const initialRankLevel = initialState.rank.level
      return editingRankLevel !== initialRankLevel
    }

    default:
      return false
  }
}

const hasModifiedState = ({ initialState, stagedState }) =>
  !!initialState && !isJsonEqual(initialState, stagedState)

const initialConceptState = (concept, pendingHistory) => {
  return {
    ...aliasesState(concept, pendingHistory),
    ...fieldState(concept),
    ...mediaState(concept, pendingHistory),
    ...structureState(concept, pendingHistory),
  }
}

export { CONCEPT_STATE, hasModifiedState, initialConceptState, isStateModified }
