import { createTitle } from '@/components/common/factory/createComponent'
import PanelModal from '@/components/modal/PanelModal'
import useReferencesActionsComponent from './useReferencesActionsComponent.jsx'
import useReferencesContentComponent from './useReferencesContentComponent'
import { useMemo } from 'react'

const useReferencesModal = (modalConfig, modalDataRef, closeModalRef) => {
  const ActionsComponent = useReferencesActionsComponent(modalConfig)
  const ContentComponent = useReferencesContentComponent(modalConfig)

  return useMemo(() => {
    if (!modalConfig) return null

    const Title = createTitle({ title: modalConfig.title })

    const ReferencesModalComponent = () => (
      <PanelModal
        actions={ActionsComponent}
        content={ContentComponent}
        title={Title}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return ReferencesModalComponent
  }, [modalConfig, ActionsComponent, ContentComponent, closeModalRef])
}

export default useReferencesModal
