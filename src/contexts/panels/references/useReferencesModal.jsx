import PanelModal from '@/components/modal/PanelModal'
import Title from '@/components/common/factory/Title'
import useReferencesActionsComponent from './useReferencesActionsComponent'
import useReferencesContentComponent from './useReferencesContentComponent'
import { useMemo } from 'react'

const useReferencesModal = (modalConfig, modalDataRef, closeModalRef) => {
  const ActionsComponent = useReferencesActionsComponent(modalConfig)
  const ContentComponent = useReferencesContentComponent(modalConfig)

  return useMemo(() => {
    if (!modalConfig) return null

    const ReferencesModalComponent = () => (
      <PanelModal
        actions={<ActionsComponent />}
        content={<ContentComponent />}
        titleComponent={modalConfig.titleComponent ? <modalConfig.titleComponent /> : undefined}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return ReferencesModalComponent
  }, [modalConfig, closeModalRef])
}

export default useReferencesModal
