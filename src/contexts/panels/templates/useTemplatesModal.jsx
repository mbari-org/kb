import { useMemo } from 'react'

import PanelModal from '@/components/modal/PanelModal'

const useTemplatesModal = (modalConfig, modalDataRef, closeModalRef) => {
  return useMemo(() => {
    if (!modalConfig) return null

    const TemplatesModalComponent = () => (
      <PanelModal
        actions={modalConfig.actionsComponent ? <modalConfig.actionsComponent /> : null}
        content={modalConfig.contentComponent ? <modalConfig.contentComponent /> : null}
        titleComponent={modalConfig.titleComponent ? <modalConfig.titleComponent /> : undefined}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return TemplatesModalComponent
  }, [modalConfig, closeModalRef])
}

export default useTemplatesModal
