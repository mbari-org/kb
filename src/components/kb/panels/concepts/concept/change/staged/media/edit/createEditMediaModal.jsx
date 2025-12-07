import ConceptTitle from '@/components/common/ConceptTitle'

import DeleteMediaActions from '@/components/kb/panels/concepts/concept/change/staged/media/delete/DeleteMediaActions'
import DeleteMediaContent from '@/components/kb/panels/concepts/concept/change/staged/media/delete/DeleteMediaContent'

import EditMediaActions from '@/components/kb/panels/concepts/concept/change/staged/media/edit/EditMediaActions'
import EditMediaContent from '@/components/kb/panels/concepts/concept/change/staged/media/edit/EditMediaContent'

import { createModal } from '@/components/modal/conceptModalFactory'

import { CONCEPT_STATE } from '@/lib/kb/constants/conceptState.js'

const createEditMediaModal = action => {
  const createComponents = () => {
    const Title = () => <ConceptTitle />

    switch (action) {
      case CONCEPT_STATE.MEDIA_ITEM.ADD: {
        return {
          Actions: EditMediaActions,
          Content: () => <EditMediaContent />,
          Title,
        }
      }
      case CONCEPT_STATE.MEDIA_ITEM.DELETE: {
        return {
          Actions: DeleteMediaActions,
          Content: DeleteMediaContent,
          Title,
        }
      }
      case CONCEPT_STATE.MEDIA_ITEM.EDIT: {
        return {
          Actions: EditMediaActions,
          Content: () => <EditMediaContent />,
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

export default createEditMediaModal
