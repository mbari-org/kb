import DeleteMediaActions from '@/components/kb/panels/concepts/detail/media/delete/DeleteMediaActions'
import DeleteMediaContent from '@/components/kb/panels/concepts/detail/media/delete/DeleteMediaContent'
import EditMediaActions from '@/components/kb/panels/concepts/detail/media/edit/EditMediaActions'
import EditMediaContent from '@/components/kb/panels/concepts/detail/media/edit/EditMediaContent'
import EditMediaTitle from '@/components/kb/panels/concepts/detail/media/edit/EditMediaTitle'

import { createModal } from '@/components/modal/factory'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

const createEditMediaModal = action => {
  const createComponents = () => {
    const Title = () => <EditMediaTitle action={action} />

    switch (action) {
      case CONCEPT_STATE.MEDIA.ADD: {
        return {
          Actions: EditMediaActions,
          Content: () => <EditMediaContent />,
          Title,
        }
      }
      case CONCEPT_STATE.MEDIA.DELETE: {
        return {
          Actions: DeleteMediaActions,
          Content: DeleteMediaContent,
          Title,
        }
      }
      case CONCEPT_STATE.MEDIA.EDIT: {
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
