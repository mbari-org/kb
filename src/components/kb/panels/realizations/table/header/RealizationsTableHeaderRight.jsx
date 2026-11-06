import { use } from 'react'

import useAddRealizationButton from '@/components/kb/panels/realizations/form/useAddRealizationButton'

import UserContext from '@/contexts/user/UserContext'

const RealizationsTableHeaderRight = () => {
  const { isReadOnly } = use(UserContext)
  const addRealizationButton = useAddRealizationButton()

  if (isReadOnly) {
    return null
  }

  return addRealizationButton()
}

export default RealizationsTableHeaderRight
