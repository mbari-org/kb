import { useState } from "react"

import ModalContext from "./ModalContext"

const ModalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [modalWarn, setModalWarn] = useState(null)

  return (
    <ModalContext value={{ loading, modalWarn, setLoading, setModalWarn }}>
      {children}
    </ModalContext>
  )
}

export default ModalProvider
