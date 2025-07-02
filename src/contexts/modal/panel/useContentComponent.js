import { use, useMemo } from 'react'
import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

const useContentComponent = (modalConfig, _modalDataRef) => {
  return useMemo(() => {
    if (!modalConfig) return null

    const PanelModalContent = () => {
      const { modalData } = use(PanelModalContext)
      return modalConfig.content(modalData)
    }

    return PanelModalContent
  }, [modalConfig])
}

export default useContentComponent
