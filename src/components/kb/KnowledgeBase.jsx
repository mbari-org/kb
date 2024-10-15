import { use, useTransition } from "react"

import Box from "@mui/material/Box"

import NavBar from "@/components/kb/nav/NavBar"
import Panel from "@/components/kb/panels/Panel"

import SelectedContext from "@/contexts/selected/SelectedContext"

const KnowledgeBase = () => {
  const { selected, updatePanel } = use(SelectedContext)

  const [_isPending, startTransition] = useTransition()

  const selectPanel = panelName => {
    if (panelName !== selected.panel) {
      startTransition(() => {
        updatePanel(panelName)
      })
    }
  }

  if (!selected) {
    return null
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <NavBar activePanel={selected.panel} selectPanel={selectPanel} />
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Panel name={selected.panel} />
      </Box>
    </Box>
  )
}

export default KnowledgeBase
