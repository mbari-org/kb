import { use, useEffect, useTransition } from "react"

import StatusContext from "@/contexts/status/StatusContext"

import NavBar from "@/components/kb/nav/NavBar"
import Panel from "@/components/kb/Panel"

const KnowledgeBase = () => {
  const { status, updateStatus } = use(StatusContext)

  const [isPending, startTransition] = useTransition()

  const selectPanel = panelName => {
    if (panelName !== status.panel) {
      startTransition(() => {
        updateStatus({ panel: panelName })
      })
    }
  }

  useEffect(() => {
    console.log("CxDebug KnowledgeBase status", status)
  }, [status])

  if (!status) {
    return null
  }

  return (
    <>
      <NavBar activePanel={status.panel} selectPanel={selectPanel} />
      <Panel name={status.panel} />
    </>
  )
}

export default KnowledgeBase
