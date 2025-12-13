import { useCallback, useState, useMemo } from 'react'

import AppModalContext from './AppModalContext'
import useSetProcessing from '@/lib/hooks/useSetProcessing'
import CONFIG from '@/text'

const { PROCESSING } = CONFIG

const AppModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null)
  const [modalData, setModalData] = useState({})
  const [onClose, setOnClose] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState(PROCESSING.OFF)
  const [suppressDisplay, setSuppressDisplay] = useState(false)

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
      setProcessing(false)

      return true
    },
    [onClose, modalData, processing]
  )

  const handleSetModal = useCallback((modal, onCloseCallback) => {
    setModal(modal)
    setOnClose(typeof onCloseCallback === 'function' ? onCloseCallback : null)
  }, [])

  const handleSetProcessing = useSetProcessing(setProcessing, setProcessingMessage)

  const resetProcessing = useCallback(() => {
    setProcessing(false)
    setProcessingMessage(PROCESSING.OFF)
  }, [])

  const value = useMemo(
    () => ({
      closeModal,
      processing,
      processingMessage,
      modal,
      modalData,
      setModalData,
      setModal: handleSetModal,
      setProcessing: handleSetProcessing,
      setProcessingMessage,
      suppressDisplay,
      setSuppressDisplay,
      resetProcessing,
    }),
    [closeModal, processing, processingMessage, modal, modalData, handleSetModal, handleSetProcessing, setProcessingMessage, suppressDisplay, resetProcessing]
  )

  return <AppModalContext value={value}>{children}</AppModalContext>
}

export default AppModalProvider
