import { useState } from "react"

import ModalContext from "./ModalContext"

const ModalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  return (
    <ModalContext
      value={{
        loading,
        alert,
        setLoading,
        setAlert,
      }}
    >
      {children}
    </ModalContext>
  )
}

export default ModalProvider
