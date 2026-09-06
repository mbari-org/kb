import { use, useCallback, useState, useMemo, useEffect, useRef } from 'react'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptModalContext from './ConceptModalContext'
import ConceptModalDataContext from './ConceptModalDataContext'
import ConceptModalProcessingContext from './ConceptModalProcessingContext'
import useProcessingManager from '@/lib/hooks/useProcessingManager'

const ConceptModalProvider = ({ children }) => {
  const { setSuppressDisplay } = use(AppModalContext)
  const [modal, setModal] = useState(null)
  const [modalData, setModalData] = useState({})
  const {
    beginProcessing,
    processing,
    processingMessage,
    resetProcessing,
    withProcessing,
  } = useProcessingManager()

  const modalDataRef = useRef(modalData)
  const onCloseRef = useRef(null)
  const processingRef = useRef(processing)

  useEffect(() => {
    setSuppressDisplay(Boolean(processing))
  }, [processing, setSuppressDisplay])

  useEffect(() => {
    modalDataRef.current = modalData
  }, [modalData])

  useEffect(() => {
    processingRef.current = processing
  }, [processing])

  const closeModal = useCallback(
    (confirmed, onComplete) => {
      // if processing, don't close unless forced
      if (processingRef.current && !confirmed) {
        return false
      }

      if (onCloseRef.current && !confirmed) {
        const shouldClose = onCloseRef.current(modalDataRef.current)
        if (shouldClose === false) {
          return false
        }
      }

      // Reset state
      onCloseRef.current = null
      setModalData({})
      setModal(null)
      resetProcessing()

      // Execute completion callback after React has completed all updates
      if (onComplete) {
        // Use setTimeout to ensure we're outside the current render cycle
        setTimeout(onComplete, 0)
      }

      return true
    },
    [resetProcessing]
  )

  const handleSetModal = useCallback((modal, onCloseCallback) => {
    setModal(modal)
    onCloseRef.current = onCloseCallback
  }, [])

  const value = useMemo(
    () => ({
      closeModal,
      setModalData,
      setModal: handleSetModal,
      beginProcessing,
      withProcessing,
    }),
    [closeModal, handleSetModal, beginProcessing, withProcessing]
  )

  const dataValue = useMemo(() => ({ modal, modalData }), [modal, modalData])

  const processingValue = useMemo(
    () => ({ processing, processingMessage }),
    [processing, processingMessage]
  )

  return (
    <ConceptModalContext value={value}>
      <ConceptModalDataContext value={dataValue}>
        <ConceptModalProcessingContext value={processingValue}>
          {children}
        </ConceptModalProcessingContext>
      </ConceptModalDataContext>
    </ConceptModalContext>
  )
}

export default ConceptModalProvider
