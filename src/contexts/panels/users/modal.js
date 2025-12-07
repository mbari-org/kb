import createPanelModalProvider from '@/contexts/common/createPanelModalProvider'
import useUsersModal from './useUsersModal'

// Create the complete modal provider setup for users
const {
  DataContext: UsersModalDataContext,
  OperationsContext: UsersModalOperationsContext,
  Provider: UsersModalProvider,
  useDataContext: useUsersModalDataContext,
  useOperationsContext: useUsersModalOperationsContext,
} = createPanelModalProvider('Users', useUsersModal)

export {
  UsersModalDataContext,
  UsersModalOperationsContext,
  UsersModalProvider,
  useUsersModalDataContext,
  useUsersModalOperationsContext,
}

