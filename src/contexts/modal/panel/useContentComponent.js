import { use, useMemo } from 'react'
import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

const useContentComponent = (modalConfig, modalDataRef) => {
  return useMemo(() => {
    if (!modalConfig) return null

    const PanelModalContent = () => {
      const { modalData } = use(PanelModalContext)
      return modalConfig.content(modalData)
    }

    return PanelModalContent
  }, [modalConfig, modalDataRef])
}

export default useContentComponent
