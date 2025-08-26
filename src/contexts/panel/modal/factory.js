import createPanelModalProvider from '@/contexts/common/createPanelModalProvider'
import usePanelModal from './usePanelModal'

const {
  DataContext: PanelModalDataContext,
  OperationsContext: PanelModalOperationsContext,
  Provider: PanelModalProvider,
  useDataContext: usePanelModalDataContext,
  useOperationsContext: usePanelModalOperationsContext,
} = createPanelModalProvider('Panel', usePanelModal)

export {
  PanelModalDataContext,
  PanelModalOperationsContext,
  PanelModalProvider,
  usePanelModalDataContext,
  usePanelModalOperationsContext,
}
