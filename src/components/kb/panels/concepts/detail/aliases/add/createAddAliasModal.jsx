import AddAliasActions from './AddAliasActions'
import AddAliasContent from './AddAliasContent'
import AddAliasTitle from './AddAliasTitle'

import { createModal } from '@/components/modal/factory'

const createAddAliasModal = setAliasData => {
  const components = {
    Actions: AddAliasActions,
    Content: () => <AddAliasContent setAliasData={setAliasData} />,
    Title: AddAliasTitle,
  }

  return createModal(components)
}

export default createAddAliasModal
