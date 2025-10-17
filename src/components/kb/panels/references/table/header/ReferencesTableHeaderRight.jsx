import { use } from 'react'

import useAddReferenceButton from '@/components/kb/panels/references/table/header/useAddReferenceButton'

import UserContext from '@/contexts/user/UserContext'

import { isReadOnly } from '@/lib/auth/role'

const ReferencesTableHeaderRight = () => {
  const { user } = use(UserContext)
  const addReferenceButton = useAddReferenceButton()

  if (isReadOnly(user)) {
    return null
  }

  return addReferenceButton()
}

export default ReferencesTableHeaderRight
