import { useState } from "react"

import ModalContext from "./ModalContext"

const ModalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [modalAlert, setModalAlert] = useState(null)

  return (
    <ModalContext
      value={{
        loading,
        modalAlert,
        setLoading,
        setModalAlert,
      }}
    >
      {children}
    </ModalContext>
  )
}

export default ModalProvider
