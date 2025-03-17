import ChangeNameActions from './ChangeNameActions'
import ChangeNameContent from './ChangeNameContent'
import ChangeNameTitle from './ChangeNameTitle'

import useCreateEditingModal from '@/components/kb/panels/concepts/detail/useCreateEditingModal'

const useChangeName = () => {
  const createEditingModal = useCreateEditingModal({
    Actions: ChangeNameActions,
    Content: ChangeNameContent,
    Title: ChangeNameTitle,
  })

  return createEditingModal
}

export default useChangeName
