import { useMemo } from 'react'
import PanelModal from '@/components/modal/PanelModal'
import Actions from '@/components/common/factory/Actions'

// Generic modal hook for the panel area. It receives modalConfig, a ref to modalData, and a ref to closeModal.
const usePanelModal = (modalConfig, modalDataRef, closeModalRef) => {
  return useMemo(() => {
    if (!modalConfig) return null

    const ActionsComponent = () => {
      const actions = modalConfig.actions
      const modalData = modalDataRef.current
      const currentActions = typeof actions === 'function' ? actions(modalData) : actions

      // If actions is already a React node, just return it
      if (!Array.isArray(currentActions)) return currentActions

      const colors = currentActions.map(action => action.color || 'main')
      const disabled = currentActions.map(action => action.disabled || false)
      const labels = currentActions.map(action => action.label)

      const onAction = label => {
        const action = currentActions.find(currentAction => currentAction.label === label)
        if (action && action.onClick) action.onClick()
      }

      return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
    }

    const ContentComponent = () => {
      const modalData = modalDataRef.current
      // CxTBD Fix this
      return typeof modalConfig.content === 'function'
        ? modalConfig.content(modalData)
        : modalConfig.content
    }

    const PanelResolvedModal = () => (
      <PanelModal
        actions={<ActionsComponent />}
        content={<ContentComponent />}
        titleText={modalConfig.title}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return PanelResolvedModal
  }, [modalConfig, modalDataRef, closeModalRef])
}

export default usePanelModal
