import { useState } from "react"

import ModalContext from "./ModalContext"

const ModalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [modalMessage, setModalMessage] = useState(null)

  return (
    <ModalContext
      value={{ loading, modalMessage, setLoading, setModalMessage }}
    >
      {children}
    </ModalContext>
  )
}

export default ModalProvider
