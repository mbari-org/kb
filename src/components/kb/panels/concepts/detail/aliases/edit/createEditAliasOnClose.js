import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const {  RESET } = CONCEPT_STATE

const createEditAliasOnClose = ({ initialState, modifyConcept }) => {
  return modalData => {
    const { modified, aliasIndex } = modalData

    if (!modified) {
      return true
    }

    modifyConcept({
      type: RESET.ALIAS,
      update: { aliasIndex, alias: initialState.aliases[aliasIndex] },
    })
    return false
  }
}

export default createEditAliasOnClose
