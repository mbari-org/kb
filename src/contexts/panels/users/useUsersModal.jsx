import { useMemo } from 'react'

import PanelModal from '@/components/modal/PanelModal'

const useUsersModal = (modalConfig, modalDataRef, closeModalRef) => {
  return useMemo(() => {
    if (!modalConfig) return null

    const UsersModalComponent = () => (
      <PanelModal
        actions={modalConfig.actionsComponent ? <modalConfig.actionsComponent /> : null}
        content={modalConfig.contentComponent ? <modalConfig.contentComponent /> : null}
        titleComponent={modalConfig.titleComponent ? <modalConfig.titleComponent /> : undefined}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return UsersModalComponent
  }, [modalConfig, closeModalRef])
}

export default useUsersModal
