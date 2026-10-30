import createPanelModalProvider from '@/contexts/common/createPanelModalProvider'
import useRealizationsModal from './useRealizationsModal'

const {
  DataContext: RealizationsModalDataContext,
  OperationsContext: RealizationsModalOperationsContext,
  Provider: RealizationsModalProvider,
  useDataContext: useRealizationsModalDataContext,
  useOperationsContext: useRealizationsModalOperationsContext,
} = createPanelModalProvider('Realizations', useRealizationsModal)

export {
  RealizationsModalDataContext,
  RealizationsModalOperationsContext,
  RealizationsModalProvider,
  useRealizationsModalDataContext,
  useRealizationsModalOperationsContext,
}
