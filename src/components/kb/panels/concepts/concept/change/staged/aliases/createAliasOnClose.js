import { CONCEPT_STATE } from '@/lib/constants'
import { hasTrue } from '@/lib/utils'

const createAliasOnClose = ({ initialState, modifyConcept }) => {
  return modalData => {
    const { modified, aliasIndex } = modalData
    const isModified = hasTrue(modified)

    if (!isModified) {
      return true
    }

    modifyConcept({
      type: CONCEPT_STATE.RESET.ALIASES,
      update: { aliases: initialState.aliases, index: aliasIndex },
    })
    return false
  }
}

export default createAliasOnClose
