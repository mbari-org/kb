import { use, useEffect } from 'react'

import createAppModal from '@/components/modal/app/createAppModal'

import LogoutActions from '@/components/kb/browserBack/LogoutActions'
import LogoutContent from '@/components/kb/browserBack/LogoutContent'
import LogoutTitle from '@/components/kb/browserBack/LogoutTitle'

import AppModalContext from '@/contexts/app/AppModalContext'

const useBrowserBack = () => {
  const { setModal } = use(AppModalContext)

  useEffect(() => {
    const handlePopState = event => {
      event.preventDefault()
      window.history.pushState(null, '', window.location.href)

      const modal = createAppModal({
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
