import { useState } from "react"

import ModalContext from "./ModalContext"

const ModalProvider = ({ children }) => {
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <ModalContext
      value={{
        alert,
        loading,
        setAlert,
        setLoading,
      }}
    >
      {children}
    </ModalContext>
  )
}

export default ModalProvider
