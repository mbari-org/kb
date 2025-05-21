import { aliasesState } from '@/lib/kb/state/aliases'
import { fieldState } from '@/lib/kb/state/field'
import { mediaState } from '@/lib/kb/state/media'
import { structureState } from '@/lib/kb/state/structure'

import { isEqual, isJsonEqual } from '@/lib/util'

import { CONCEPT_FIELDS } from '@/lib/constants'

const isStateModified = (stagedState, initialState, field, index) => {
  switch (field) {
    case CONCEPT_FIELDS.ALIASES: {
      const editingAlias = stagedState.aliases[index]
      const initialAlias = initialState.aliases[index]
      return !isEqual(editingAlias, initialAlias)
    }
    case CONCEPT_FIELDS.MEDIA: {
      const editingMediaItem = stagedState.media[index]
      const initialMediaItem = initialState.media[index]
      return !isEqual(editingMediaItem, initialMediaItem)
    }

    case CONCEPT_FIELDS.PARENT: {
      const editingParent = stagedState.parent
      const initialParent = initialState.parent
      return editingParent !== initialParent
    }

    case CONCEPT_FIELDS.PRIMARY.NAME: {
      const editingName = stagedState.primary.name
      const initialName = initialState.primary.name
      return editingName !== initialName
    }

    case CONCEPT_FIELDS.PRIMARY.AUTHOR: {
      const editingAuthor = stagedState.primary.author
      const initialAuthor = initialState.primary.author
      return editingAuthor !== initialAuthor
    }

    case CONCEPT_FIELDS.RANK.NAME: {
      const editingRankName = stagedState.rank.name
      const initialRankName = initialState.rank.name
      return editingRankName !== initialRankName
    }

    case CONCEPT_FIELDS.RANK.LEVEL: {
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

const initialConceptState = (concept, pending) => {
  return {
    ...aliasesState(concept, pending),
    ...fieldState(concept),
    ...mediaState(concept, pending),
    ...structureState(concept, pending),
  }
}

export { hasModifiedState, initialConceptState, isStateModified }
