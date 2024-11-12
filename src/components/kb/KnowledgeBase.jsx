import { use, useTransition } from "react"

import { Box } from "@mui/material"

import LoadingBackdrop from "@/components/kb/LoadingBackdrop"
import NavBar from "@/components/kb/nav/NavBar"
import Panel from "@/components/kb/panels/Panel"

import SelectedContext from "@/contexts/selected/SelectedContext"

const KnowledgeBase = () => {
  const { selected, updateSelectedPanel } = use(SelectedContext)

  const [_isPending, startTransition] = useTransition()

  const selectPanel = panelName => {
    if (panelName !== selected.panel) {
      startTransition(() => {
        updateSelectedPanel(panelName)
      })
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <NavBar activePanel={selected.panel} selectPanel={selectPanel} />
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Panel name={selected.panel} />
      </Box>
      <LoadingBackdrop />
    </Box>
  )
}

export default KnowledgeBase
