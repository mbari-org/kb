import { use } from 'react'

import { createActions } from '@/components/modal/factory'

import PanelModalContext from '@/contexts/modal/PanelModalContext'

import { LABELS } from '@/lib/constants'

const { CLOSE } = LABELS.BUTTON

const LastAdminActions = () => {
  const { closeModal } = use(PanelModalContext)

  const colors = ['main']
  const disabled = [false]
  const labels = [CLOSE]

  const onAction = async label => {
    switch (label) {
      case CLOSE:
        closeModal()
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'LastAdminActions')
}

export default LastAdminActions
