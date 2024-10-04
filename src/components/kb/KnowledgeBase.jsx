import { use, useEffect, useTransition } from "react"

import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import NavBar from "@/components/kb/nav/NavBar"
import Panel from "@/components/kb/Panel"

const KnowledgeBase = () => {
  const { selected, updateSelected } = use(SelectedContext)
  const { taxonomy, updateTaxonomy } = use(TaxonomyContext)

  const [isPending, startTransition] = useTransition()

  const selectPanel = panelName => {
    if (panelName !== selected.panel) {
      startTransition(() => {
        updateSelected({ panel: panelName })
      })
    }
  }

  useEffect(() => {
    if (!taxonomy[selected.concept]) {
      updateTaxonomy(selected.concept)
    }
  }, [selected, taxonomy])

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
