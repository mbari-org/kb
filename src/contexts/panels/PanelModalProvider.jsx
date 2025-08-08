import createPanelModalProvider from '@/contexts/common/createPanelModalProvider'
import usePanelModal from './usePanelModal'

const {
  DataContext: PanelsModalDataContext,
  OperationsContext: PanelsModalOperationsContext,
  Provider: PanelsModalProvider,
  useDataContext: usePanelsModalDataContext,
  useOperationsContext: usePanelsModalOperationsContext,
} = createPanelModalProvider('Panels', usePanelModal)

export {
  PanelsModalDataContext,
  PanelsModalOperationsContext,
  PanelsModalProvider,
  usePanelsModalDataContext,
  usePanelsModalOperationsContext,
}

