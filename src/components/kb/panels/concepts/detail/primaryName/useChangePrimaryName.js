import { use, useCallback } from 'react'

import PrimaryNameActions from './PrimaryNameActions'
import PrimaryNameContent from './PrimaryNameContent'
import PrimaryNameTitle from './PrimaryNameTitle'

import { createModal } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

const useChangePrimaryName = ({ onClose }) => {
  const { setModal } = use(ModalContext)

  return useCallback(() => {
    const modal = createModal({
      Actions: PrimaryNameActions,
      Content: PrimaryNameContent,
      Title: PrimaryNameTitle,
    })
    onClose()
    setModal(modal)
  }, [onClose, setModal])
}

export default useChangePrimaryName
