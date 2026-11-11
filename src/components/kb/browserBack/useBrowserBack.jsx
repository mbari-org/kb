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
 * The dummy entry is pushed on the first user interaction (pointerdown/keydown); browsers skip history entries
 * added without a user gesture, so pushing on mount would defeat the interception.
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

    const pushDummyEntry = () => {
      removeInteractionListeners()
      if (!window.history.state?.isDummyEntry) {
        window.history.pushState({ isDummyEntry: true }, '', window.location.href)
      }
    }

    const removeInteractionListeners = () => {
      window.removeEventListener('pointerdown', pushDummyEntry)
      window.removeEventListener('keydown', pushDummyEntry)
    }

    window.addEventListener('pointerdown', pushDummyEntry)
    window.addEventListener('keydown', pushDummyEntry)
    window.addEventListener('popstate', handlePopState)

    return () => {
      removeInteractionListeners()
      window.removeEventListener('popstate', handlePopState)
    }
  }, [setModal])
}

export default useBrowserBack
