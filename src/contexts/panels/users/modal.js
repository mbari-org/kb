import createPanelModalProvider from '@/contexts/common/createPanelModalProvider'
import usePanelModal from '@/contexts/panel/modal/usePanelModal'

const {
  DataContext: UsersModalDataContext,
  OperationsContext: UsersModalOperationsContext,
  Provider: UsersModalProvider,
  useDataContext: useUsersModalDataContext,
  useOperationsContext: useUsersModalOperationsContext,
} = createPanelModalProvider('Users', usePanelModal)

export {
  UsersModalDataContext,
  UsersModalOperationsContext,
  UsersModalProvider,
  useUsersModalDataContext,
  useUsersModalOperationsContext,
}
