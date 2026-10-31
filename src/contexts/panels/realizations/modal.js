import createPanelModalProvider from '@/contexts/common/createPanelModalProvider'
import usePanelModal from '@/contexts/panel/modal/usePanelModal'

const {
  DataContext: RealizationsModalDataContext,
  OperationsContext: RealizationsModalOperationsContext,
  Provider: RealizationsModalProvider,
  useDataContext: useRealizationsModalDataContext,
  useOperationsContext: useRealizationsModalOperationsContext,
} = createPanelModalProvider('Realizations', usePanelModal)

export {
  RealizationsModalDataContext,
  RealizationsModalOperationsContext,
  RealizationsModalProvider,
  useRealizationsModalDataContext,
  useRealizationsModalOperationsContext,
}
