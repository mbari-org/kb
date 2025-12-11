import { createContext, useCallback, useEffect, useMemo, useState, useRef, useContext } from 'react'

import useSetProcessing from '@/lib/hooks/useSetProcessing'
import CONFIG from '@/text'

const { PROCESSING } = CONFIG

const createPanelModalProvider = (panelName, useModalHook) => {
  const DataContext = createContext()
  const OperationsContext = createContext()

  DataContext.displayName = `${panelName}ModalDataContext`
  OperationsContext.displayName = `${panelName}ModalOperationsContext`

  const Provider = ({ children }) => {
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
        setProcessing(PROCESSING.OFF)

        return true
      },
      [onClose, processing]
    )

    useEffect(() => {
      closeModalRef.current = closeModal
    }, [closeModal])

    const createModal = useCallback(
      ({ actionsComponent, contentComponent, titleComponent, data = {}, minWidth = 500, onClose = null }) => {
        const modalConfig = {
          actionsComponent,
          contentComponent,
          minWidth,
          titleComponent,
        }

        setModalConfig(modalConfig)
        setModalData(data)
        setOnClose(() => onClose)
        setProcessing(PROCESSING.OFF)
      },
      []
    )

    const updateModalData = useCallback(data => {
      setModalData(prev => ({ ...prev, ...data }))
    }, [])

    const handleSetProcessing = useSetProcessing(setProcessing)

    useEffect(() => {
      modalDataRef.current = modalData
    }, [modalData])

    const modal = useModalHook(modalConfig, modalDataRef, closeModalRef)

    // Operations context - doesn't include modalData to prevent unnecessary re-renders
    const operationsValue = useMemo(
      () => ({
        closeModal,
        createModal,
        modal,
        processing,
        setProcessing: handleSetProcessing,
        updateModalData,
      }),
      [closeModal, createModal, modal, processing, handleSetProcessing, updateModalData]
    )

    // Data context - only includes modalData for modal content components
    const dataValue = useMemo(
      () => ({
        modalData,
      }),
      [modalData]
    )

    return (
      <OperationsContext.Provider value={operationsValue}>
        <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>
      </OperationsContext.Provider>
    )
  }

  Provider.displayName = `${panelName}ModalProvider`

  const useDataContext = () => {
    const context = useContext(DataContext)
    if (context === undefined) {
      throw new Error(
        `use${panelName}ModalDataContext must be used within a ${panelName}ModalProvider`
      )
    }
    return context
  }

  const useOperationsContext = () => {
    const context = useContext(OperationsContext)
    if (context === undefined) {
      throw new Error(
        `use${panelName}ModalOperationsContext must be used within a ${panelName}ModalProvider`
      )
    }
    return context
  }

  useDataContext.displayName = `use${panelName}ModalDataContext`
  useOperationsContext.displayName = `use${panelName}ModalOperationsContext`

  return {
    DataContext,
    OperationsContext,
    Provider,
    useDataContext,
    useOperationsContext,
  }
}

export default createPanelModalProvider
