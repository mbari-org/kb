import { use, useTransition } from "react"

import NavBar from "@/components/nav/NavBar"

import panels from "@/components/panels/panels"

import StatusContext from "@/contexts/app/StatusContext"

const NavPanels = () => {
  const { status, updateStatus } = use(StatusContext)

  const [isPending, startTransition] = useTransition()

  const selectPanel = panelTitle => {
    if (panelTitle !== status.panel) {
      startTransition(() => {
        updateStatus({ panel: panelTitle })
      })
    }
  }

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
