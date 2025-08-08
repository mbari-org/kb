import { useMemo } from 'react'

import PanelModal from '@/components/modal/PanelModal'

import useUsersActionsComponent from './useUsersActionsComponent'
import useUsersContentComponent from './useUsersContentComponent'

const useUsersModal = (modalConfig, modalDataRef, closeModalRef) => {
  const ActionsComponent = useUsersActionsComponent(modalConfig)
  const ContentComponent = useUsersContentComponent(modalConfig)

  return useMemo(() => {
    if (!modalConfig) return null

    const UsersModalComponent = () => (
      <PanelModal
        actions={<ActionsComponent />}
        content={<ContentComponent />}
        titleText={modalConfig.title}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return UsersModalComponent
  }, [modalConfig, closeModalRef])
}

export default useUsersModal
