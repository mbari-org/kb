import { createTitle } from '@/components/common/factory/createComponent'
import PanelModal from '@/components/modal/PanelModal'
import useUsersActionsComponent from './useUsersActionsComponent.jsx'
import useUsersContentComponent from './useUsersContentComponent'
import { useMemo } from 'react'

const useUsersModal = (modalConfig, modalDataRef, closeModalRef) => {
  const ActionsComponent = useUsersActionsComponent(modalConfig)
  const ContentComponent = useUsersContentComponent(modalConfig)

  return useMemo(() => {
    if (!modalConfig) return null

    const Title = createTitle({ title: modalConfig.title })

    const UsersModalComponent = () => (
      <PanelModal
        actions={ActionsComponent}
        content={ContentComponent}
        title={Title}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return UsersModalComponent
  }, [modalConfig, ActionsComponent, ContentComponent, closeModalRef])
}

export default useUsersModal
