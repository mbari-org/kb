import PrimaryNameActions from './PrimaryNameActions'
import PrimaryNameContent from './PrimaryNameContent'
import PrimaryNameTitle from './PrimaryNameTitle'

import useCreateEditingModal from '@/components/kb/panels/concepts/detail/useCreateEditingModal'

const useChangePrimaryName = () => {
  const createEditingModal = useCreateEditingModal({
    Actions: PrimaryNameActions,
    Content: PrimaryNameContent,
    Title: PrimaryNameTitle,
  })

  return createEditingModal
}

export default useChangePrimaryName
