import { useMemo } from 'react'
import { useTemplatesModalDataContext } from './modal'

const useTemplatesContentComponent = modalConfig => {
  return useMemo(() => {
    if (!modalConfig) return null

    const TemplatesModalContent = () => {
      const { modalData } = useTemplatesModalDataContext()
      return modalConfig.content(modalData)
    }

    return TemplatesModalContent
  }, [modalConfig])
}

export default useTemplatesContentComponent
