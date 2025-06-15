import UsersPanel from '@/components/kb/panels/users/UsersPanel'
import UsersProvider from '@/contexts/panels/users/UsersProvider'

const Users = () => {
  return (
    <UsersProvider>
      <UsersPanel />
    </UsersProvider>
  )
}

export default Users
