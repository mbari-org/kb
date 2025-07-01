import { useMemo } from 'react'

const useContentComponent = (modalConfig, modalDataRef) => {
  return useMemo(() => {
    if (!modalConfig) return null

    const PanelModalContent = () => {
      return modalConfig.content(modalDataRef.current)
    }

    return PanelModalContent
  }, [modalConfig, modalDataRef])
}

export default useContentComponent
