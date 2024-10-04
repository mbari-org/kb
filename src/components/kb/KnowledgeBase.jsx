import { use, useEffect, useTransition } from "react"

import SelectedContext from "@/contexts/selected/SelectedContext"

import NavBar from "@/components/kb/nav/NavBar"
import Panel from "@/components/kb/Panel"

const KnowledgeBase = () => {
  const { selected, updateSelected } = use(SelectedContext)

  const [isPending, startTransition] = useTransition()

  const selectPanel = panelName => {
    if (panelName !== selected.panel) {
      startTransition(() => {
        updateSelected({ panel: panelName })
      })
    }
  }

  if (!selected) {
    return null
  }

  return (
    <>
      <NavBar activePanel={selected.panel} selectPanel={selectPanel} />
      <Panel name={selected.panel} />
    </>
  )
}

export default KnowledgeBase
