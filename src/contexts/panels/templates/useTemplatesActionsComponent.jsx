import { useMemo } from 'react'
import Actions from '@/components/common/factory/Actions'
import { useTemplatesModalDataContext } from './modal'

const useTemplatesActionsComponent = modalConfig => {
  return useMemo(() => {
    if (!modalConfig) return null

    const TemplatesModalActions = () => {
      const { modalData } = useTemplatesModalDataContext()
      const { actions } = modalConfig

      // CxTBD Fix this
      const currentActions = typeof actions === 'function' ? actions(modalData) : actions

      const colors = currentActions.map(action => action.color || 'main')
      const disabled = currentActions.map(action => action.disabled || false)
      const labels = currentActions.map(action => action.label)

      const onAction = label => {
        const action = currentActions.find(currentAction => currentAction.label === label)
        if (action && action.onClick) {
          action.onClick()
        }
      }

      return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
    }

    return TemplatesModalActions
  }, [modalConfig])
}

export default useTemplatesActionsComponent
