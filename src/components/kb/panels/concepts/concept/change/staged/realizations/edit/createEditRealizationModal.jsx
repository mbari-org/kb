import DeleteRealizationActions from '@/components/kb/panels/concepts/concept/change/staged/realizations/delete/DeleteRealizationActions'
import DeleteRealizationContent from '@/components/kb/panels/concepts/concept/change/staged/realizations/delete/DeleteRealizationContent'
import EditRealizationActions from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/EditRealizationActions'
import EditRealizationContent from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/EditRealizationContent'
import EditRealizationTitle from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/EditRealizationTitle'

import { createModal } from '@/components/modal/conceptModalFactory'

import { CONCEPT_STATE } from '@/lib/constants'

const createEditRealizationModal = action => {
  const createComponents = () => {
    const Title = () => <EditRealizationTitle action={action} />

    switch (action) {
      case CONCEPT_STATE.REALIZATION.ADD: {
        return {
          Actions: EditRealizationActions,
          Content: EditRealizationContent,
          Title,
        }
      }
      case CONCEPT_STATE.REALIZATION.DELETE: {
        return {
          Actions: DeleteRealizationActions,
          Content: DeleteRealizationContent,
          Title,
        }
      }
      case CONCEPT_STATE.REALIZATION.EDIT: {
        return {
          Actions: EditRealizationActions,
          Content: EditRealizationContent,
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

export default createEditRealizationModal
