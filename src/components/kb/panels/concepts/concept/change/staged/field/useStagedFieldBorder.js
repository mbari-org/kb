import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT } from '@/lib/constants'

const useStagedFieldBorder = field => {
  const { initialState, stagedState } = use(ConceptContext)

  const isStaged = field => {
    switch (field) {
      case CONCEPT.FIELD.AUTHOR:
        return initialState.author !== stagedState.author

      case CONCEPT.FIELD.RANK_NAME:
        return initialState.rank.name !== stagedState.rank.name

      case CONCEPT.FIELD.RANK_LEVEL:
        return initialState.rank.level !== stagedState.rank.level

      default:
        return false
    }
  }

  const [borderColor, borderStyle, borderWidth] = isStaged(field)
    ? ['edit.main', 'dashed', '2px']
    : ['transparent', 'none', '0px']

  return { borderColor, borderStyle, borderWidth }
}

export default useStagedFieldBorder
