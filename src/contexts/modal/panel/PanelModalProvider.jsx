import { useCallback, useMemo, useState, useRef } from 'react'

import PanelModal from '@/components/modal/PanelModal'
import Actions from '@/components/common/factory/Actions'

import { createTitle } from '@/components/common/factory/createComponent'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

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

  // Memoize Actions component separately to avoid unnecessary re-creation
  const ActionsComponent = useMemo(() => {
    if (!modalConfig) return null
    
    return () => {
      const { actions } = modalConfig
      
      // Support both static actions array and dynamic actions function
      const currentActions = typeof actions === 'function' ? actions(modalDataRef.current) : actions
      
      const colors = currentActions.map(action => action.color || 'main')
      const disabled = currentActions.map(action => action.disabled || false)
      const labels = currentActions.map(action => action.label)

      const onAction = label => {
        const action = currentActions.find(a => a.label === label)
        if (action && action.onClick) {
          action.onClick()
        }
      }

      return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
    }
  }, [modalConfig, modalData?.isValid, modalData?.hasChanges])

  // Memoize Content component to only recreate when modalConfig changes, not modalData
  const ContentComponent = useMemo(() => {
    if (!modalConfig) return null
    
    return () => {
      return modalConfig.content(modalDataRef.current)
    }
  }, [modalConfig])

  // Create the modal function when needed
  const modal = useMemo(() => {
    if (!modalConfig) return null

    const Title = createTitle({ title: modalConfig.title })

    const ModalComponent = () => (
      <PanelModal
        Actions={ActionsComponent}
        Content={ContentComponent}
        Title={Title}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )
    ModalComponent.displayName = 'PanelModalComponent'

    return ModalComponent
  }, [modalConfig, ActionsComponent, ContentComponent])

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
