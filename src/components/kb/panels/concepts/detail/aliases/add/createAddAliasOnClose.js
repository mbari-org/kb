import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const createAddAliasOnClose = ({ initialState, modifyConcept }) => {
  return modalData => {
    const { modified, aliasIndex } = modalData

    if (!modified) {
      return true
    }

    modifyConcept({
      type: CONCEPT_STATE.RESET.ALIAS_ITEM,
      update: { aliasIndex, alias: initialState.aliases[aliasIndex] },
    })
    return false
  }
}

export default createAddAliasOnClose
