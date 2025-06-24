import { use, useEffect } from 'react'

import { createModal } from '@/components/modal/factory'

import AppModalContext from '@/contexts/modal/AppModalContext'

import LogoutActions from '@/components/kb/browserBack/LogoutActions'
import LogoutContent from '@/components/kb/browserBack/LogoutContent'
import LogoutTitle from '@/components/kb/browserBack/LogoutTitle'

const useBrowserBack = () => {
  const { setModal } = use(AppModalContext)

  useEffect(() => {
    const handlePopState = event => {
      event.preventDefault()
      window.history.pushState(null, '', window.location.href)

      const modal = createModal({
        Actions: LogoutActions,
        Content: LogoutContent,
        Title: LogoutTitle,
      })
      setModal(modal)
    }

    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [setModal])
}

export default useBrowserBack
