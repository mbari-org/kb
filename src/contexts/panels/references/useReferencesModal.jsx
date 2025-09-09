import PanelModal from '@/components/modal/PanelModal'
import { useMemo } from 'react'

const useReferencesModal = (modalConfig, modalDataRef, closeModalRef) => {
  return useMemo(() => {
    if (!modalConfig) return null

    const ReferencesModalComponent = () => (
      <PanelModal
        actions={modalConfig.actionsComponent ? <modalConfig.actionsComponent /> : null}
        content={modalConfig.contentComponent ? <modalConfig.contentComponent /> : null}
        titleComponent={modalConfig.titleComponent ? <modalConfig.titleComponent /> : undefined}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return ReferencesModalComponent
  }, [modalConfig, closeModalRef])
}

export default useReferencesModal
