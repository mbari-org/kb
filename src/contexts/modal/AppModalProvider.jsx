import { useCallback, useState, useMemo } from 'react'

import AppModalContext from './AppModalContext'

const AppModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [onClose, setOnClose] = useState(null)
  const [processing, setProcessing] = useState(false)

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
      setModalData(null)
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

  const value = useMemo(
    () => ({
      closeModal,
      processing,
      modal,
      modalData,
      setModalData,
      setModal: handleSetModal,
      setProcessing,
    }),
    [closeModal, processing, modal, modalData, handleSetModal]
  )

  return <AppModalContext value={value}>{children}</AppModalContext>
}

export default AppModalProvider
