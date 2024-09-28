import { use, useEffect, useState, useTransition } from "react"

import AuthContext from "@/contexts/auth/AuthContext"

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
const KnowledgeBase = () => {
  const { updateUser, user } = use(AuthContext)

  // CxNote panel is just the title (immutable string and to match user.panel)
  const [panel, setPanel] = useState(null)
  const [isPending, startTransition] = useTransition()

  const selectPanel = panelTitle => {
    if (panelTitle !== panel) {
      startTransition(() => {
        setPanel(panelTitle)
        updateUser({ panel: panelTitle })
      })
    }
  }

  useEffect(() => {
    if (user && !panel) {
      setPanel(user.panel)
    }
  }, [user, panel])

  if (!panel) {
    return null
  }

  return (
    <>
      <NavBar
        activePanel={panel}
        titles={panels.map(({ title }) => title)}
        selectPanel={selectPanel}
      />
      {panels.map(navPanel => {
        return navPanel.title === panel ? (
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
