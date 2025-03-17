import AddChildActions from './AddChildActions'
import AddChildContent from './AddChildContent'
import AddChildTitle from './AddChildTitle'

import useCreateEditingModal from '@/components/kb/panels/concepts/detail/useCreateEditingModal'

const useAddChild = () => {
  const createEditingModal = useCreateEditingModal({
    Actions: AddChildActions,
    Content: AddChildContent,
    Title: AddChildTitle,
  })

  return createEditingModal
}

export default useAddChild
