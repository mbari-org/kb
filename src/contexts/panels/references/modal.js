import createPanelModalProvider from '../../common/createPanelModalProvider'
import useReferencesModal from './useReferencesModal'

// Create the complete modal provider setup for references
const {
  DataContext: ReferencesModalDataContext,
  OperationsContext: ReferencesModalOperationsContext,
  Provider: ReferencesModalProvider,
  useDataContext: useReferencesModalDataContext,
  useOperationsContext: useReferencesModalOperationsContext,
} = createPanelModalProvider('References', useReferencesModal)

export {
  ReferencesModalDataContext,
  ReferencesModalOperationsContext,
  ReferencesModalProvider,
  useReferencesModalDataContext,
  useReferencesModalOperationsContext,
}
