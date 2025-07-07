import { useCallback, useState, useMemo } from 'react'
import { flushSync } from 'react-dom'

import ConceptModalContext from './ConceptModalContext'

const ConceptModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null)
  const [modalData, setModalData] = useState({})
  const [onClose, setOnClose] = useState(null)
  const [processing, setProcessing] = useState(false)

  const closeModal = useCallback(
    (confirmed, onComplete) => {
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

      // Use flushSync to ensure all state updates are committed synchronously
      flushSync(() => {
        setOnClose(null)
        setModalData({})
        setModal(null)
        setProcessing(false)
      })

      // Execute completion callback after React has completed all updates
      if (onComplete) {
        // Use setTimeout to ensure we're outside the current render cycle
        setTimeout(onComplete, 0)
      }

      return true
    },
    [onClose, modalData, processing]
  )

  const handleSetModal = useCallback((modal, onCloseCallback) => {
    setModal(modal)
    // Use function wrapper to properly store function in useState
    setOnClose(() => onCloseCallback)
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

  return <ConceptModalContext value={value}>{children}</ConceptModalContext>
}

export default ConceptModalProvider
