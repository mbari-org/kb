import DeleteRealizationActions from '@/components/kb/panels/concepts/concept/change/staged/realizations/delete/DeleteRealizationActions'
import DeleteRealizationContent from '@/components/kb/panels/concepts/concept/change/staged/realizations/delete/DeleteRealizationContent'
import RealizationActions from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/RealizationActions'
import RealizationContent from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/RealizationContent'
import RealizationTitle from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/RealizationTitle'

import { createModal } from '@/components/modal/conceptModalFactory'

import { CONCEPT_STATE } from '@/lib/constants'

const createRealizationModal = action => {
  const createComponents = () => {
    const Title = () => <RealizationTitle action={action} />

    switch (action) {
      case CONCEPT_STATE.REALIZATION.ADD: {
        return {
          Actions: RealizationActions,
          Content: RealizationContent,
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
          Actions: RealizationActions,
          Content: RealizationContent,
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

export default createRealizationModal
