import { createTitle } from '@/components/common/factory/createComponent'
import PanelModal from '@/components/modal/PanelModal'
import useActionsComponent from '@/contexts/modal/panel/useActionsComponent.jsx'
import useContentComponent from '@/contexts/modal/panel/useContentComponent'
import { useMemo } from 'react'

const usePanelModal = (modalConfig, modalDataRef, closeModalRef) => {
  const ActionsComponent = useActionsComponent(modalConfig, modalDataRef)
  const ContentComponent = useContentComponent(modalConfig, modalDataRef)

  return useMemo(() => {
    if (!modalConfig) return null

    const Title = createTitle({ title: modalConfig.title })

    const PanelModalComponent = () => (
      <PanelModal
        Actions={ActionsComponent}
        Content={ContentComponent}
        Title={Title}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return PanelModalComponent
  }, [modalConfig, ActionsComponent, ContentComponent, closeModalRef])
}

export default usePanelModal
