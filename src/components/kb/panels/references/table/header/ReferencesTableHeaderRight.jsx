import { use } from 'react'

import useAddReferenceButton from '@/components/kb/panels/references/table/header/useAddReferenceButton'

import UserContext from '@/contexts/user/UserContext'

const ReferencesTableHeaderRight = () => {
  const { isReadOnly } = use(UserContext)
  const addReferenceButton = useAddReferenceButton()

  if (isReadOnly) {
    return null
  }

  return addReferenceButton()
}

export default ReferencesTableHeaderRight
