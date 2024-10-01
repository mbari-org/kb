import { use, useTransition } from "react"

import userStore from "@/lib/store/user"

import NavBar from "@/components/nav/NavBar"

import panels from "@/components/nav/panels"

import UserContext from "@/contexts/user/UserContext"

const KnowledgeBase = () => {
  const { user, updateUser } = use(UserContext)

  const [isPending, startTransition] = useTransition()

  const selectPanel = panelTitle => {
    if (panelTitle !== user.panel) {
      startTransition(() => {
        updateUser({ panel: panelTitle })
      })
    }
  }

  if (!user) {
    return null
  }

  return (
    <>
      <NavBar
        activePanel={user.panel}
        titles={panels.map(({ title }) => title)}
        selectPanel={selectPanel}
      />
      {panels.map(panel => {
        return panel.title === user.panel ? (
          <panel.mod id={`nav-panel-${panel.title}`} key={panel.title} />
        ) : null
      })}
    </>
  )
}

export default KnowledgeBase
