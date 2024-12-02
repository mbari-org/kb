import { useState } from "react"

import ModalContext from "./ModalContext"

const ModalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [modalError, setModalError] = useState(null)

  return (
    <ModalContext value={{ loading, modalError, setLoading, setModalError }}>
      {children}
    </ModalContext>
  )
}

export default ModalProvider
