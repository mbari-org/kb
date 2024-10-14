import { use, useEffect, useState } from "react"

import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"
import SelectedContext from "@/contexts/selected/SelectedContext"

import selectedStore from "@/lib/store/selected"

const SelectedProvider = ({ children }) => {
  const { getConcept, loadConcept, taxonomy } = use(TaxonomyContext)

  const [selected, setSelected] = useState(null)

  const updateSelected = update => {
    const updated = selected ? { ...selected, ...update } : update
    selectedStore.set(updated)
    setSelected(updated)
  }

  const updatePanel = panel => {
    if (panel !== selected.panel) {
      updateSelected({ panel })
    }
  }

  const updateConcept = conceptName => {
    if (conceptName !== selected.concept) {
      loadConcept(conceptName).then(() => {
        updateSelected({ concept: conceptName })
      })

      // const concept = getConcept(conceptName)
      // if (concept) {
      //   updateSelected({ concept: concept.name })
      // } else {
      //   loadConcept(conceptName).then(() => {
      //     updateSelected({ concept: conceptName })
      //   })
      // }
    }
  }

  useEffect(() => {
    if (taxonomy) {
      const initialSelected = selectedStore.get() || {
        concept: taxonomy.root.name,
        panel: "Concepts",
      }
      setSelected(initialSelected)
    }
  }, [taxonomy])

  if (!selected) {
    return null
  }

  return (
    <SelectedContext value={{ selected, updateConcept, updatePanel }}>
      {children}
    </SelectedContext>
  )
}

export default SelectedProvider
