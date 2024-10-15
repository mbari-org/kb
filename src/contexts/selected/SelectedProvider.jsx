import { use, useEffect, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"

import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"
import SelectedContext from "@/contexts/selected/SelectedContext"

import selectedStore from "@/lib/store/selected"

import panels from "@/lib/panels"

const SelectedProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { loadConcept, taxonomy } = use(TaxonomyContext)

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
      loadConcept(conceptName).then(
        () => {
          updateSelected({ concept: conceptName })
        },
        error => {
          showBoundary(error)
        }
      )
    }
  }

  useEffect(() => {
    if (taxonomy) {
      const storedSelected = selectedStore.get()
      const concept = taxonomy.names.includes(storedSelected?.concept)
        ? storedSelected.concept
        : taxonomy.root.name
      const panel = panels.map(p => p.name).includes(storedSelected?.panel)
        ? storedSelected.panel
        : panels[0].name
      const initialSelected = { concept, panel }
      selectedStore.set(initialSelected)
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
