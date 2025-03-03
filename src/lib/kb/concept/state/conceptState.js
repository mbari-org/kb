import { aliasesState } from '@/lib/kb/concept/state/aliases'
import { fieldState } from '@/lib/kb/concept/state/field'
import { mediaState } from '@/lib/kb/concept/state/media'
import { structureState } from '@/lib/kb/concept/state/structure'

import { isEqual } from '@/lib/util'

export const CONCEPT_STATE = {
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
}

export const isStateModified = (editingState, initialState, field, index) => {
  switch (field) {
    case FIELDS.ALIASES: {
      const editingAlias = editingState.aliases[index]
      const initialAlias = initialState.aliases[index]
      return !isEqual(editingAlias, initialAlias)
    }
    case FIELDS.MEDIA: {
      const editingMediaItem = editingState.media[index]
      const initialMediaItem = initialState.media[index]
      console.log(`MediaItem ${index} isModified`, !isEqual(editingMediaItem, initialMediaItem))
      return !isEqual(editingMediaItem, initialMediaItem)
    }

    case FIELDS.PARENT: {
      const editingParentName = editingState.parentName
      const initialParentName = initialState.parentName
      return editingParentName !== initialParentName
    }

    case FIELDS.PRIMARY.NAME: {
      const editingName = editingState.primary.name
      const initialName = initialState.primary.name
      return editingName !== initialName
    }

    case FIELDS.PRIMARY.AUTHOR: {
      const editingAuthor = editingState.primary.author
      const initialAuthor = initialState.primary.author
      return editingAuthor !== initialAuthor
    }

    case FIELDS.RANK.NAME: {
      const editingRankName = editingState.rank.name
      const initialRankName = initialState.rank.name
      return editingRankName !== initialRankName
    }

    case FIELDS.RANK.LEVEL: {
      const editingRankLevel = editingState.rank.level
      const initialRankLevel = initialState.rank.level
      return editingRankLevel !== initialRankLevel
    }

    default:
      return false
  }
}

const conceptState = concept => {
  return {
    ...aliasesState(concept),
    ...fieldState(concept),
    ...mediaState(concept),
    ...structureState(concept),
  }
}

export default conceptState
