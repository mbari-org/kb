import createPanelModalProvider from '@/contexts/common/createPanelModalProvider'
import usePanelModal from '@/contexts/panel/modal/usePanelModal'

const {
  DataContext: ReferencesModalDataContext,
  OperationsContext: ReferencesModalOperationsContext,
  Provider: ReferencesModalProvider,
  useDataContext: useReferencesModalDataContext,
  useOperationsContext: useReferencesModalOperationsContext,
} = createPanelModalProvider('References', usePanelModal)

export {
  ReferencesModalDataContext,
  ReferencesModalOperationsContext,
  ReferencesModalProvider,
  useReferencesModalDataContext,
  useReferencesModalOperationsContext,
}
