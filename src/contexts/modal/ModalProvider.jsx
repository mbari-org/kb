import { useCallback, useState } from 'react'

import ModalContext from './ModalContext'

const ModalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)

  const [modal, setModal] = useState(null)
  const [modalData, setModalData] = useState(null)

  const [onClose, setOnClose] = useState(null)

  const handleSetModal = useCallback(
    (modal, onCloseCallback) => {
      if (!modal) {
        setModalData(null)
        setModal(null)

        onClose?.()
        setOnClose(null)
        return
      }
      if (onCloseCallback) {
        setOnClose(() => onCloseCallback)
      }
      setModal(modal)
    },
    [onClose]
  )

  // const handleSetModalData = useCallback(data => {
  //   console.log('handleSetModalData', modalData, data)
  //   setModalData(prev => ({ ...prev, ...data }))
  // }, [])

  return (
    <ModalContext
      value={{
        modal,
        modalData,
        loading,
        setModal: handleSetModal,
        setModalData,
        setLoading,
      }}
    >
      {children}
    </ModalContext>
  )
}

export default ModalProvider
