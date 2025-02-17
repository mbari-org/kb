import { useState } from "react"

import ModalContext from "./ModalContext"

const ModalProvider = ({ children }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)

  const handleSetModal = modal => {
    setData(null)
    setModal(modal)
  }

  return (
    <ModalContext
      value={{
        modal,
        data,
        loading,
        setModal: handleSetModal,
        setData,
        setLoading,
      }}
    >
      {children}
    </ModalContext>
  )
}

export default ModalProvider
