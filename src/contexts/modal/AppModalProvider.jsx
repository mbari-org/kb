import { useCallback, useState, useMemo } from 'react'

import AppModalContext from './AppModalContext'

const AppModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [onClose, setOnClose] = useState(null)
  const [processing, setProcessing] = useState(null)

  const closeModal = useCallback(
    confirmed => {
      const closeConfirmed = !!confirmed || onClose?.(modalData) !== false

      if (closeConfirmed) {
        setOnClose(null)
        setModalData(null)
        setModal(null)
      }
    },
    [onClose, modalData]
  )

  const handleSetModal = (modal, onCloseCallback) => {
    setModal(modal)
    setOnClose(() => onCloseCallback || null)
  }

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
    [closeModal, processing, modal, modalData, setModalData, setProcessing]
  )

  return <AppModalContext value={value}>{children}</AppModalContext>
}

export default AppModalProvider
