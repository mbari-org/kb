import { use, useEffect } from 'react'

import createAppModal from '@/components/modal/app/createAppModal'

import LogoutActions from '@/components/kb/browserBack/LogoutActions'
import LogoutContent from '@/components/kb/browserBack/LogoutContent'
import LogoutTitle from '@/components/kb/browserBack/LogoutTitle'

import AppModalContext from '@/contexts/app/AppModalContext'

/**
 * Intercepts browser back button to show logout confirmation modal instead of navigating away from the app.
 *
 * Requires at least 2 history entries to work:
 *   1. The actual page entry
 *   2. A dummy entry (marked with isDummyEntry flag) that enables popstate to fire
 *
 * When the user clicks back, popstate fires, we intercept it, show the logout modal, and push a new dummy entry to
 * keep the handler active.
 */

const useBrowserBack = () => {
  const { setModal } = use(AppModalContext)

  useEffect(() => {
    const handlePopState = event => {
      event.preventDefault()
      window.history.pushState({ isDummyEntry: true }, '', window.location.href)

      const modal = createAppModal({
        Actions: LogoutActions,
        Content: LogoutContent,
        Title: LogoutTitle,
      })
      setModal(modal)
    }

    const currentState = window.history.state
    const isAlreadyDummy = currentState?.isDummyEntry

    if (!isAlreadyDummy) {
      window.history.pushState({ isDummyEntry: true }, '', window.location.href)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [setModal])
}

export default useBrowserBack
