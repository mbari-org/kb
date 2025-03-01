import AddMediaActions from '@/components/kb/panels/concepts/detail/media/add/AddMediaActions'
import DeleteMediaActions from '@/components/kb/panels/concepts/detail/media/delete/DeleteMediaActions'
import DeleteMediaContent from '@/components/kb/panels/concepts/detail/media/delete/DeleteMediaContent'
import EditMediaActions from '@/components/kb/panels/concepts/detail/media/edit/EditMediaActions'
import EditMediaContent from '@/components/kb/panels/concepts/detail/media/edit/EditMediaContent'
import EditMediaTitle from '@/components/kb/panels/concepts/detail/media/edit/EditMediaTitle'

import useCreateEditingModal from '@/components/kb/panels/concepts/detail/useCreateEditingModal'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const useEditMedia = (action, mediaIndex) => {
  const Title = () => <EditMediaTitle action={action} />

  let components
  switch (action) {
    case CONCEPT_STATE.MEDIA.ADD: {
      components = {
        Actions: () => <AddMediaActions />,
        Content: () => <EditMediaContent mediaIndex={mediaIndex} />,
        Title,
      }
      break
    }

    case CONCEPT_STATE.MEDIA.DELETE: {
      components = {
        Actions: () => <DeleteMediaActions mediaIndex={mediaIndex} />,
        Content: () => <DeleteMediaContent mediaIndex={mediaIndex} />,
        Title,
      }
      break
    }

    case CONCEPT_STATE.MEDIA.EDIT: {
      components = {
        Actions: EditMediaActions,
        Content: () => <EditMediaContent mediaIndex={mediaIndex} />,
        Title,
      }
      break
    }
  }

  return useCreateEditingModal(components)
}

export default useEditMedia
