import { use, useCallback } from 'react'

import AddAliasActions from './AddAliasActions'
import AddAliasContent from './AddAliasContent'
import AddAliasTitle from './AddAliasTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const useAddAlias = () => {
  const { setModal } = use(ModalContext)

  return useCallback(() => {
    const modal = createModal({
      Actions: AddAliasActions,
      Content: AddAliasContent,
      Title: AddAliasTitle,
    })
    setModal(modal)
  }, [setModal])
}

export default useAddAlias
