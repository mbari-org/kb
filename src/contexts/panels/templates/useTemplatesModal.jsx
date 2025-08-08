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
        actions={<ActionsComponent />}
        content={<ContentComponent />}
        title={<Title />}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return TemplatesModalComponent
  }, [modalConfig, closeModalRef])
}

export default useTemplatesModal
