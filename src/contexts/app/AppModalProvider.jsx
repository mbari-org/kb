import { useCallback, useState, useMemo } from 'react'

import AppModalContext from './AppModalContext'

const AppModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null)
  const [modalData, setModalData] = useState({})
  const [onClose, setOnClose] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('Processing...')

  const closeModal = useCallback(
    confirmed => {
      // if processing, don't close unless forced
      if (processing && !confirmed) {
        return false
      }

      // If we have an onClose callback, call it and check if it prevents closing
      if (onClose && !confirmed) {
        const shouldClose = onClose(modalData)
        // If callback explicitly returns false, prevent closing
        if (shouldClose === false) {
          return false
        }
      }

      setOnClose(null)
      setModalData({})
      setModal(null)
      setProcessing(false)
      setProcessingMessage('Processing...')

      return true
    },
    [onClose, modalData, processing]
  )

  const handleSetModal = useCallback((modal, onCloseCallback) => {
    setModal(modal)
    setOnClose(typeof onCloseCallback === 'function' ? onCloseCallback : null)
  }, [])

  const handleSetProcessing = useCallback(state => {
    if (typeof state === 'string') {
      setProcessing(true)
      setProcessingMessage(state)
    } else {
      setProcessing(state)
      if (!state) {
        setProcessingMessage('Processing...')
      }
    }
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
    }),
    [closeModal, processing, processingMessage, modal, modalData, handleSetModal, handleSetProcessing]
  )

  return <AppModalContext value={value}>{children}</AppModalContext>
}

export default AppModalProvider
