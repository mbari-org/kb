import { useMemo } from 'react'
import PanelModal from '@/components/modal/PanelModal'

const usePanelModal = (modalConfig, modalDataRef, closeModalRef) => {
  return useMemo(() => {
    if (!modalConfig) return null

    const ResolvedPanelModal = () => {
      if (!modalConfig.contentComponent) {
        throw new Error('modalConfig.contentComponent is required')
      }

      return (
        <PanelModal
          actions={<modalConfig.actionsComponent />}
          content={<modalConfig.contentComponent />}
          titleComponent={modalConfig.titleComponent ? <modalConfig.titleComponent /> : undefined}
          closeModal={closeModalRef.current}
          minWidth={modalConfig.minWidth}
        />
      )
    }

    return ResolvedPanelModal
  }, [modalConfig, closeModalRef])
}

export default usePanelModal
