import { useCallback, useMemo, useState, useRef } from 'react'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

import usePanelModal from '@/contexts/modal/panel/usePanelModal.jsx'

const PanelModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState(null)
  const [modalData, setModalData] = useState({})
  const [onClose, setOnClose] = useState(null)
  const [processing, setProcessing] = useState(false)

  const closeModalRef = useRef()
  const modalDataRef = useRef(modalData)

  const closeModal = useCallback(
    confirmed => {
      // if processing, only close if confirmed
      if (processing && !confirmed) {
        return false
      }

      // If we have an onClose callback, call it and check if it prevents closing
      if (onClose && !confirmed) {
        const shouldClose = onClose(modalData)
        if (shouldClose === false) {
          return false
        }
      }

      setOnClose(null)
      setModalData({})
      setModalConfig(null)
      setProcessing(false)

      return true
    },
    [onClose, modalData, processing]
  )

  // Store the current closeModal function in a ref
  closeModalRef.current = closeModal

  const createModal = useCallback(
    ({ actions, content, title, data = {}, minWidth = 500, onClose }) => {
      const onCloseCallback = typeof onClose === 'function' ? onClose : null

      const modalConfig = {
        actions,
        content,
        title,
        minWidth,
      }

      setModalConfig(modalConfig)
      setModalData(data)
      setOnClose(onCloseCallback)
      setProcessing(false)
    },
    []
  )

  const updateModalData = useCallback(data => {
    setModalData(prev => {
      const newData = { ...prev, ...data }
      modalDataRef.current = newData // Keep ref in sync
      return newData
    })
  }, [])

  // Keep ref in sync with state
  modalDataRef.current = modalData

  const modal = usePanelModal(modalConfig, modalDataRef, closeModalRef)

  const value = useMemo(
    () => ({
      closeModal,
      createModal,
      modal,
      modalData,
      modalDataRef,
      processing,
      setProcessing,
      updateModalData,
    }),
    [closeModal, createModal, modal, modalData, processing, setProcessing, updateModalData]
  )

  return <PanelModalContext value={value}>{children}</PanelModalContext>
}

export default PanelModalProvider
