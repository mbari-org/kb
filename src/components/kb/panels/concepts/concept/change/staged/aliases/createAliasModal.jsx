import DeleteAliasActions from '@/components/kb/panels/concepts/concept/change/staged/aliases/delete/DeleteAliasActions'
import DeleteAliasContent from '@/components/kb/panels/concepts/concept/change/staged/aliases/delete/DeleteAliasContent'

import EditAliasActions from '@/components/kb/panels/concepts/concept/change/staged/aliases/edit/EditAliasActions'
import EditAliasContent from '@/components/kb/panels/concepts/concept/change/staged/aliases/edit/EditAliasContent'
import EditAliasTitle from '@/components/kb/panels/concepts/concept/change/staged/aliases/edit/EditAliasTitle'

import { createModal } from '@/components/modal/conceptModalFactory'

import { CONCEPT_STATE } from '@/lib/constants'

const createAliasModal = action => {
  const createComponents = () => {
    const Title = () => <EditAliasTitle action={action} />

    switch (action) {
      case CONCEPT_STATE.ALIAS_ITEM.ADD: {
        return {
          Actions: EditAliasActions,
          Content: EditAliasContent,
          Title,
        }
      }
      case CONCEPT_STATE.ALIAS_ITEM.DELETE: {
        return {
          Actions: DeleteAliasActions,
          Content: DeleteAliasContent,
          Title,
        }
      }
      case CONCEPT_STATE.ALIAS_ITEM.EDIT: {
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
