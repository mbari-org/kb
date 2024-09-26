import { use, useEffect, useState, useTransition } from "react"

import AuthContext from "@/components/auth/AuthContext"

import NavBar from "@/components/nav/NavBar"

import AboutHelp from "@/components/nav/panels/AboutHelp"
import Concepts from "@/components/nav/panels/Concepts"
import Embargoes from "@/components/nav/panels/Embargoes"
import History from "@/components/nav/panels/History"
import ImportExport from "@/components/nav/panels/ImportExport"
import Notes from "@/components/nav/panels/Notes"
import References from "@/components/nav/panels/References"
import Templates from "@/components/nav/panels/Templates"

const panels = [
  { mod: Concepts, title: "Concepts" },
  { mod: Templates, title: "Templates" },
  { mod: References, title: "References" },
  { mod: Embargoes, title: "Embargoes" },
  { mod: History, title: "History" },
  { mod: Notes, title: "Notes" },
  { mod: ImportExport, title: "Import/Export" },
  { mod: AboutHelp, title: "About/Help" },
]
const panelTitles = panels.map(({ title }) => title)

const findPanel = title =>
  panels.find(({ title: panelTitle }) => title === panelTitle)

const KnowledgeBase = () => {
  const { updateUser, user } = use(AuthContext)

  const [panel, setPanel] = useState(null)
  const [isPending, startTransition] = useTransition()

  const selectPanel = panelTitle => {
    startTransition(() => {
      const activatePanel = findPanel(panelTitle)
      setPanel(activatePanel)
      updateUser({ panel: panelTitle })
    })
  }

  useEffect(() => {
    if (user && !panel) {
      const userPanel = findPanel(user.panel)
      setPanel(userPanel)
    }
  }, [user, panel])

  if (!panel) {
    return null
  }

  return (
    <>
      <NavBar
        activeTitle={panel.title}
        titles={panelTitles}
        selectPanel={selectPanel}
      />
      {panels.map(navPanel => {
        return navPanel.title === panel.title ? (
          <navPanel.mod
            id={`nav-panel-${navPanel.title}`}
            key={navPanel.title}
          />
        ) : null
      })}
    </>
  )
}

export default KnowledgeBase
