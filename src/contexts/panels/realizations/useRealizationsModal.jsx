import { useMemo } from 'react'

import PanelModal from '@/components/modal/PanelModal'

const useRealizationsModal = (modalConfig, modalDataRef, closeModalRef) => {
  return useMemo(() => {
    if (!modalConfig) return null

    const RealizationsModalComponent = () => (
      <PanelModal
        actions={modalConfig.actionsComponent ? <modalConfig.actionsComponent /> : null}
        content={modalConfig.contentComponent ? <modalConfig.contentComponent /> : null}
        titleComponent={modalConfig.titleComponent ? <modalConfig.titleComponent /> : undefined}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return RealizationsModalComponent
  }, [modalConfig, closeModalRef])
}

export default useRealizationsModal
