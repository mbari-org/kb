import { createTitle } from '@/components/common/factory/createComponent'
import PanelModal from '@/components/modal/PanelModal'
import useTemplatesActionsComponent from './useTemplatesActionsComponent.jsx'
import useTemplatesContentComponent from './useTemplatesContentComponent'
import { useMemo } from 'react'

const useTemplatesModal = (modalConfig, modalDataRef, closeModalRef) => {
  const ActionsComponent = useTemplatesActionsComponent(modalConfig)
  const ContentComponent = useTemplatesContentComponent(modalConfig)

  return useMemo(() => {
    if (!modalConfig) return null

    const Title = createTitle({ title: modalConfig.title })

    const TemplatesModalComponent = () => (
      <PanelModal
        Actions={ActionsComponent}
        Content={ContentComponent}
        Title={Title}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return TemplatesModalComponent
  }, [modalConfig, ActionsComponent, ContentComponent, closeModalRef])
}

export default useTemplatesModal
