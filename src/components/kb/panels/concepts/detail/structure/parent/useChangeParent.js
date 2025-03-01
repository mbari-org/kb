import ParentActions from './ParentActions'
import ParentContent from './ParentContent'
import ParentTitle from './ParentTitle'

import useCreateEditingModal from '@/components/kb/panels/concepts/detail/useCreateEditingModal'

const useChangeParent = () => {
  const createEditingModal = useCreateEditingModal({
    Actions: ParentActions,
    Content: ParentContent,
    Title: ParentTitle,
  })

  return createEditingModal
}

export default useChangeParent
