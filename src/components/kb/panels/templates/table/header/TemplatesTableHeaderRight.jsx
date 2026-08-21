import { use } from 'react'

import useAddTemplateButton from '@/components/kb/panels/templates/form/useAddTemplateButton'

import UserContext from '@/contexts/user/UserContext'

const TemplatesTableHeaderRight = () => {
  const { isReadOnly } = use(UserContext)
  const addTemplateButton = useAddTemplateButton()

  if (isReadOnly) {
    return null
  }

  return addTemplateButton()
}

export default TemplatesTableHeaderRight
