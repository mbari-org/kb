import { useCallback, useState } from 'react'

import ModalContext, { MODAL_X } from './ModalContext'

const ModalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)

  const [modal, setModal] = useState(null)

  const [onClose, setOnClose] = useState(null)

  const handleSetModal = useCallback(
    (modal, onCloseCallback) => {
      if (modal === MODAL_X) {
        onClose?.(MODAL_X)
        setOnClose(null)
        return
      }

      if (!modal) {
        onClose?.()
        setModal(null)
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

  return (
    <ModalContext
      value={{
        modal,
        loading,
        setModal: handleSetModal,
        setLoading,
      }}
    >
      {children}
    </ModalContext>
  )
}

export default ModalProvider
