import { use } from 'react'

import useAddReferenceButton from '@/components/kb/panels/references/table/header/useAddReferenceButton'

import { isReadOnly } from '@/lib/auth/role'

import UserContext from '@/contexts/user/UserContext'

const ReferencesTableHeaderRight = () => {
  const { user } = use(UserContext)
  const addReferenceButton = useAddReferenceButton()

  if (isReadOnly(user)) {
    return null
  }

  return addReferenceButton()
}

export default ReferencesTableHeaderRight
