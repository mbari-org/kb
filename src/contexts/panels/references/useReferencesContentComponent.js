import { useMemo } from 'react'
import { useReferencesModalDataContext } from './modal'

const useReferencesContentComponent = modalConfig => {
  return useMemo(() => {
    if (!modalConfig) return null

    const ReferencesModalContent = () => {
      const { modalData } = useReferencesModalDataContext()
      return modalConfig.content(modalData)
    }

    return ReferencesModalContent
  }, [modalConfig])
}

export default useReferencesContentComponent
