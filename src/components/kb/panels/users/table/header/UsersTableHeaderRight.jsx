import PanelAddButton from '@/components/common/panel/PanelAddButton'

import useAddUserModal from '@/components/kb/panels/users/form/add/useAddUserModal'

const UsersTableHeaderRight = () => {
  const addUserModal = useAddUserModal()

  return <PanelAddButton onClick={addUserModal} />
}

export default UsersTableHeaderRight
