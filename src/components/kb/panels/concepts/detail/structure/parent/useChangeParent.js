import ChangeParentActions from './ChangeParentActions'
import ChangeParentContent from './ChangeParentContent'
import ChangeParentTitle from './ChangeParentTitle'

import useCreateEditingModal from '@/components/kb/panels/concepts/detail/useCreateEditingModal'

const useChangeParent = () => {
  const createEditingModal = useCreateEditingModal({
    Actions: ChangeParentActions,
    Content: ChangeParentContent,
    Title: ChangeParentTitle,
  })

  return createEditingModal
}

export default useChangeParent
