import { use, useCallback, useState, useMemo, useEffect } from 'react'
import { flushSync } from 'react-dom'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptModalContext from './ConceptModalContext'

const ConceptModalProvider = ({ children }) => {
  const { setSuppressDisplay } = use(AppModalContext)
  const [modal, setModal] = useState(null)
  const [modalData, setModalData] = useState({})
  const [onClose, setOnClose] = useState(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    setSuppressDisplay(Boolean(processing))
  }, [processing, setSuppressDisplay])

  const closeModal = useCallback(
    (confirmed, onComplete) => {
      // if processing, don't close unless forced
      if (processing && !confirmed) {
        return false
      }

      if (onClose && !confirmed) {
        const shouldClose = onClose(modalData)
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
