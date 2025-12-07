import ConceptTitle from '@/components/common/ConceptTitle'

import DeleteAliasActions from '@/components/kb/panels/concepts/concept/change/staged/aliases/delete/DeleteAliasActions'
import DeleteAliasContent from '@/components/kb/panels/concepts/concept/change/staged/aliases/delete/DeleteAliasContent'

import EditAliasActions from '@/components/kb/panels/concepts/concept/change/staged/aliases/edit/EditAliasActions'
import EditAliasContent from '@/components/kb/panels/concepts/concept/change/staged/aliases/edit/EditAliasContent'

import { createModal } from '@/components/modal/conceptModalFactory'

import { CONCEPT_STATE } from '@/lib/kb/constants/conceptState.js'

const createAliasModal = action => {
  const createComponents = () => {
    const Title = () => <ConceptTitle />

    switch (action) {
      case CONCEPT_STATE.ALIAS.ADD: {
        return {
          Actions: EditAliasActions,
          Content: EditAliasContent,
          Title,
        }
      }
      case CONCEPT_STATE.ALIAS.DELETE: {
        return {
          Actions: DeleteAliasActions,
          Content: DeleteAliasContent,
          Title,
        }
      }
      case CONCEPT_STATE.ALIAS.EDIT: {
        return {
          Actions: EditAliasActions,
          Content: EditAliasContent,
          Title,
        }
      }
      default: {
        return null
      }
    }
  }

  const components = createComponents()
  return createModal(components)
}

export default createAliasModal
