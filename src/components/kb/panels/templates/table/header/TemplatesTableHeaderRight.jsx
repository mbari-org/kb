import { use } from 'react'

import useAddTemplateButton from '@/components/kb/panels/templates/form/useAddTemplateButton'

import { isReadOnly } from '@/lib/auth/role'

import UserContext from '@/contexts/user/UserContext'

const TemplatesTableHeaderRight = () => {
  const { user } = use(UserContext)
  const addTemplateButton = useAddTemplateButton()

  if (isReadOnly(user)) {
    return null
  }

  return addTemplateButton()
}

export default TemplatesTableHeaderRight
