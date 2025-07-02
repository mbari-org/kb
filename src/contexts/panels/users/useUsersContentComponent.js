import { useMemo } from 'react'
import { useUsersModalDataContext } from './modal'

const useUsersContentComponent = modalConfig => {
  return useMemo(() => {
    if (!modalConfig) return null

    const UsersModalContent = () => {
      const { modalData } = useUsersModalDataContext()
      return modalConfig.content(modalData)
    }

    return UsersModalContent
  }, [modalConfig])
}

export default useUsersContentComponent
