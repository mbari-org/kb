import AddAliasActions from './AddAliasActions'
import AddAliasContent from './AddAliasContent'
import AddAliasTitle from './AddAliasTitle'

import useCreateEditingModal from '@/components/kb/panels/concepts/detail/useCreateEditingModal'

const useAddAlias = () => {
  const components = {
    Actions: AddAliasActions,
    Content: AddAliasContent,
    Title: AddAliasTitle,
  }

  return useCreateEditingModal(components)
}

export default useAddAlias
