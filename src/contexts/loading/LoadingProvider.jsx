import { useState } from "react"

import LoadingContext from "./LoadingContext"

const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)

  return (
    <LoadingContext value={{ loading, setLoading }}>{children}</LoadingContext>
  )
}

export default LoadingProvider
