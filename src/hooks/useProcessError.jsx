import { use, useEffect } from 'react'

import { createModal } from '@/components/modal/panelModalFactory'

import AppModalContext from '@/contexts/app/AppModalContext'

import ErrorActions from '@/components/kb/error/ErrorActions'
import ErrorContent from '@/components/kb/error/ErrorContent'
import ErrorTitle from '@/components/kb/error/ErrorTitle'

const useProcessError = error => {
  const { setModal } = use(AppModalContext)

  useEffect(() => {
    if (error) {
      const modal = createModal({
        Actions: ErrorActions,
        Content: ErrorContent,
        Title: ErrorTitle,
      })
      setModal(modal)
    }
  }, [error, setModal])
}

export default useProcessError
