import DeleteAliasActions from '@/components/kb/panels/concepts/concept/change/staged/concept/aliases/delete/DeleteAliasActions'
import DeleteAliasContent from '@/components/kb/panels/concepts/concept/change/staged/concept/aliases/delete/DeleteAliasContent'
import EditAliasActions from '@/components/kb/panels/concepts/concept/change/staged/concept/aliases/edit/EditAliasActions'
import EditAliasContent from '@/components/kb/panels/concepts/concept/change/staged/concept/aliases/edit/EditAliasContent'
import EditAliasTitle from '@/components/kb/panels/concepts/concept/change/staged/concept/aliases/edit/EditAliasTitle'

import { createModal } from '@/components/modal/factory'

import { CONCEPT_STATE } from '@/lib/constants'

const createEditAliasModal = action => {
  const createComponents = () => {
    const Title = () => <EditAliasTitle action={action} />

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

export default createEditAliasModal
