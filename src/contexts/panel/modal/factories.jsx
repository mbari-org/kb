import Actions from '@/components/common/factory/Actions'
import { usePanelModalDataContext } from '@/contexts/panel/modal/Context'

// Factory to create an action view component from an actions provider
// actionsProvider should return an array of { label, onClick, color?, disabled? }
export const createActionView = actionsProvider => {
  const ActionView = () => {
    const actions = actionsProvider()
    if (!Array.isArray(actions)) return null

    const colors = actions.map(a => a.color || 'main')
    const disabled = actions.map(a => a.disabled || false)
    const labels = actions.map(a => a.label)

    const onAction = label => {
      const a = actions.find(x => x.label === label)
      if (a && a.onClick) a.onClick()
    }

    return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
  }
  return ActionView
}

// Factory to create a content component from a content factory
// contentFactory should be a function: modalData => ReactNode
export const createContentView = contentFactory => {
  const ContentView = () => {
    const { modalData } = usePanelModalDataContext()
    return contentFactory(modalData)
  }
  return ContentView
}

