import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const createAliasOnClose = ({ initialState, modifyConcept }) => {
  return modalData => {
    // Handle case where modalData is null (defensive programming)
    if (!modalData) {
      return true
    }

    const { modified, aliasIndex } = modalData
    const isModified = Object.values(modified).some(isModified => isModified === true)

    if (!isModified) {
      return true
    }

    modifyConcept({
      type: RESET.ALIAS_ITEM,
      update: { aliasIndex, aliasItem: initialState.aliases[aliasIndex] },
    })
    return false
  }
}

export default createAliasOnClose
