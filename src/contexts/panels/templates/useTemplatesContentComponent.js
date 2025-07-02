import { use, useMemo } from 'react'
import TemplatesModalDataContext from './TemplatesModalDataContext'

const useTemplatesContentComponent = (modalConfig, modalDataRef) => {
  return useMemo(() => {
    if (!modalConfig) return null

    const TemplatesModalContent = () => {
      const { modalData } = use(TemplatesModalDataContext)
      return modalConfig.content(modalData)
    }

    return TemplatesModalContent
  }, [modalConfig, modalDataRef])
}

export default useTemplatesContentComponent
