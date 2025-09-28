import { useMemo } from 'react'
import PanelModal from '@/components/modal/PanelModal'
import { createError } from '@/lib/errors'

const usePanelModal = (modalConfig, modalDataRef, closeModalRef) => {
  return useMemo(() => {
    if (!modalConfig) return null

    const ResolvedPanelModal = () => {
      if (!modalConfig.contentComponent) {
        throw createError(
          'Invalid Modal Config',
          'Modal configuration must include a content component',
          { hasActionsComponent: !!modalConfig.actionsComponent }
        )
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
