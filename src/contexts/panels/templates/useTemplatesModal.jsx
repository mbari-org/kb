import { useMemo } from 'react'

import PanelModal from '@/components/modal/PanelModal'

import useTemplatesActionsComponent from './useTemplatesActionsComponent'
import useTemplatesContentComponent from './useTemplatesContentComponent'

const useTemplatesModal = (modalConfig, modalDataRef, closeModalRef) => {
  const ActionsComponent = useTemplatesActionsComponent(modalConfig)
  const ContentComponent = useTemplatesContentComponent(modalConfig)

  return useMemo(() => {
    if (!modalConfig) return null

    const TemplatesModalComponent = () => (
      <PanelModal
        actions={<ActionsComponent />}
        content={<ContentComponent />}
        titleComponent={modalConfig.titleComponent ? <modalConfig.titleComponent /> : undefined}
        closeModal={closeModalRef.current}
        minWidth={modalConfig.minWidth}
      />
    )

    return TemplatesModalComponent
  }, [modalConfig, closeModalRef])
}

export default useTemplatesModal
