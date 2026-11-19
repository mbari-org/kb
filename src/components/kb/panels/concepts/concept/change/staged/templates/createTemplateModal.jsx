import ConceptTitle from '@/components/common/ConceptTitle'

import DeleteTemplateActions from '@/components/kb/panels/concepts/concept/change/staged/templates/delete/DeleteTemplateActions'
import DeleteTemplateContent from '@/components/kb/panels/concepts/concept/change/staged/templates/delete/DeleteTemplateContent'
import EditTemplateActions from '@/components/kb/panels/concepts/concept/change/staged/templates/edit/EditTemplateActions'
import EditTemplateContent from '@/components/kb/panels/concepts/concept/change/staged/templates/edit/EditTemplateContent'

import { createModal } from '@/components/modal/conceptModalFactory'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const MIN_WIDTH = 750

const createTemplateModal = action => {
  const createComponents = () => {
    const Title = () => <ConceptTitle />

    switch (action) {
      case CONCEPT_STATE.TEMPLATE.ADD:
      case CONCEPT_STATE.TEMPLATE.EDIT:
        return {
          Actions: EditTemplateActions,
          Content: EditTemplateContent,
          Title,
          minWidth: MIN_WIDTH,
        }

      case CONCEPT_STATE.TEMPLATE.DELETE:
        return {
          Actions: DeleteTemplateActions,
          Content: DeleteTemplateContent,
          Title,
          minWidth: MIN_WIDTH,
        }

      default:
        throw new Error(`Invalid template modal action: ${action}`)
    }
  }

  return createModal(createComponents())
}

export default createTemplateModal
