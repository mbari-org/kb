import { useCallback, useState, useMemo } from 'react'

import AppModalContext from './AppModalContext'
import useProcessingManager from '@/lib/hooks/useProcessingManager'

const AppModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null)
  const [modalData, setModalData] = useState({})
  const [onClose, setOnClose] = useState(null)
  const [suppressDisplay, setSuppressDisplay] = useState(false)

  const {
    beginProcessing,
    processing,
    processingMessage,
    resetProcessing,
    withProcessing,
  } = useProcessingManager()

  const closeModal = useCallback(
    confirmed => {
      if (processing && !confirmed) {
        return false
      }

      if (onClose && !confirmed) {
        const shouldClose = onClose(modalData)
        if (shouldClose === false) {
          return false
        }
      }

      setOnClose(null)
      setModalData({})
      setModal(null)
      resetProcessing()

      return true
    },
    [onClose, modalData, processing, resetProcessing]
  )

  const handleSetModal = useCallback((modal, onCloseCallback) => {
    setModal(modal)
    setOnClose(typeof onCloseCallback === 'function' ? onCloseCallback : null)
  }, [])


  const value = useMemo(
    () => ({
      closeModal,
      beginProcessing,
      processing,
      processingMessage,
      modal,
      modalData,
      setModalData,
      setModal: handleSetModal,
      suppressDisplay,
      setSuppressDisplay,
      resetProcessing,
      withProcessing,
    }),
    [
      closeModal,
      processing,
      processingMessage,
      modal,
      modalData,
      handleSetModal,
      suppressDisplay,
      resetProcessing,
      beginProcessing,
      withProcessing,
    ]
  )

  return <AppModalContext value={value}>{children}</AppModalContext>
}

export default AppModalProvider
