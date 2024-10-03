import { use, useEffect, useTransition } from "react"

import NavBar from "@/components/kb/nav/NavBar"
import panels from "@/components/panels/panels"

import StatusContext from "@/contexts/status/StatusContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const NavPanels = () => {
  const { status, updateStatus } = use(StatusContext)
  const { taxonomy } = use(TaxonomyContext)

  const [isPending, startTransition] = useTransition()

  const selectPanel = panelTitle => {
    if (panelTitle !== status.panel) {
      startTransition(() => {
        updateStatus({ panel: panelTitle })
      })
    }
  }

  useEffect(() => {
    console.log("CxDebug NavPanels status", status)
    console.log("CxDebug NavPanels taxonomy", taxonomy)
  }, [status, taxonomy])

  return (
    <>
      <NavBar
        activePanel={status?.panel}
        titles={panels.map(({ title }) => title)}
        selectPanel={selectPanel}
      />
      {panels.map(panel => {
        return panel.title === status?.panel ? (
          <panel.mod id={`nav-panel-${panel.title}`} key={panel.title} />
        ) : null
      })}
    </>
  )
}

export default NavPanels
