import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import ModalContext from '@/contexts/modal/ModalContext'

import { RESET } from '@/lib/constants'

const ErrorActions = () => {
  const { closeModal } = use(ModalContext)

  const colors = ['main']
  const labels = [RESET]

  const onAction = () => {
    closeModal()
  }

  return createActions({ colors, labels, onAction }, 'ErrorActions')
}

export default ErrorActions
