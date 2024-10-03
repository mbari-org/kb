import { use, useEffect, useState } from "react"

import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"
import StatusContext from "./StatusContext"

import statusStore from "@/lib/store/status"

const StatusProvider = ({ children }) => {
  const { taxonomy } = use(TaxonomyContext)

  const [status, setStatus] = useState(null)

  const updateStatus = update => {
    if (status === null) {
      setStatus(update)
    } else if (JSON.stringify(update) !== JSON.stringify(status)) {
      const updated = { ...status, ...update }
      statusStore.set(updated)
      setStatus(updated)
    }
  }

  useEffect(() => {
    if (!!taxonomy) {
      const initialStatus = statusStore.get() || {
        concept: taxonomy._root_,
        panel: "Concepts",
      }
      setStatus(initialStatus)
    }
  }, [taxonomy])

  return (
    <StatusContext value={{ status, updateStatus }}>{children}</StatusContext>
  )
}

export default StatusProvider
