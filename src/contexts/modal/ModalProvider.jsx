import { useState } from "react"

import ModalContext from "./ModalContext"

const ModalProvider = ({ children }) => {
  const [alert, setAlert] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSetAlert = alert => {
    setData(null)
    setAlert(alert)
  }

  return (
    <ModalContext
      value={{
        alert,
        data,
        loading,
        setAlert: handleSetAlert,
        setData,
        setLoading,
      }}
    >
      {children}
    </ModalContext>
  )
}

export default ModalProvider
