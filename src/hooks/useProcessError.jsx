import { use, useEffect } from 'react'

import { createModal } from '@/components/modal/factory'

import SystemModalContext from '@/contexts/modal/SystemModalContext'

import ErrorActions from '@/components/kb/error/ErrorActions'
import ErrorContent from '@/components/kb/error/ErrorContent'
import ErrorTitle from '@/components/kb/error/ErrorTitle'

const useProcessError = error => {
  const { setModal } = use(SystemModalContext)

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
