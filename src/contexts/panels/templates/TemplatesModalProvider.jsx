import { useCallback, useMemo, useState, useRef } from 'react'

import TemplatesModalOperationsContext from './TemplatesModalOperationsContext'
import TemplatesModalDataContext from './TemplatesModalDataContext'

import useTemplatesModal from './useTemplatesModal.jsx'

const TemplatesModalProvider = ({ children }) => {
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
        const shouldClose = onClose(modalDataRef.current)
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
    [onClose, processing]
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

  const modal = useTemplatesModal(modalConfig, modalDataRef, closeModalRef)

  // Operations context - doesn't include modalData to prevent unnecessary re-renders
  const operationsValue = useMemo(
    () => ({
      closeModal,
      createModal,
      modal,
      processing,
      setProcessing,
      updateModalData,
    }),
    [closeModal, createModal, modal, processing, setProcessing, updateModalData]
  )

  // Data context - only includes modalData for modal content components
  const dataValue = useMemo(
    () => ({
      modalData,
    }),
    [modalData]
  )

  return (
    <TemplatesModalOperationsContext value={operationsValue}>
      <TemplatesModalDataContext value={dataValue}>{children}</TemplatesModalDataContext>
    </TemplatesModalOperationsContext>
  )
}

export default TemplatesModalProvider
