import { createContext, useCallback, useMemo, useState, useRef, useContext } from 'react'

/**
 * Factory function to create a complete modal provider setup for a panel
 * @param {string} panelName - Name of the panel (e.g., 'Templates', 'Concepts')
 * @param {Function} useModalHook - Panel-specific useModal hook
 * @returns {Object} Complete modal provider setup with contexts, provider, and hooks
 */
const createPanelModalProvider = (panelName, useModalHook) => {
  // Create unique contexts for this panel
  const DataContext = createContext()
  const OperationsContext = createContext()

  // Set display names for better debugging
  DataContext.displayName = `${panelName}ModalDataContext`
  OperationsContext.displayName = `${panelName}ModalOperationsContext`

  // Create the provider component
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

    const modal = useModalHook(modalConfig, modalDataRef, closeModalRef)

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
      <OperationsContext.Provider value={operationsValue}>
        <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>
      </OperationsContext.Provider>
    )
  }

  // Set display name for the provider
  Provider.displayName = `${panelName}ModalProvider`

  // Create custom hooks for accessing the contexts
  const useDataContext = () => {
    const context = useContext(DataContext)
    if (context === undefined) {
      throw new Error(`use${panelName}ModalDataContext must be used within a ${panelName}ModalProvider`)
    }
    return context
  }

  const useOperationsContext = () => {
    const context = useContext(OperationsContext)
    if (context === undefined) {
      throw new Error(`use${panelName}ModalOperationsContext must be used within a ${panelName}ModalProvider`)
    }
    return context
  }

  // Set display names for the hooks
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
