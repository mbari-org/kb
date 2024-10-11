import { use, useEffect, useState } from "react"

import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"
import SelectedContext from "@/contexts/selected/SelectedContext"

import selectedStore from "@/lib/store/selected"

const SelectedProvider = ({ children }) => {
  const { taxonomy, updateTaxonomy } = use(TaxonomyContext)

  const [selected, setSelected] = useState(null)

  const updateSelected = update => {
    let updated
    if (selected === null) {
      updated = update
    } else if (JSON.stringify(update) !== JSON.stringify(selected)) {
      updated = { ...selected, ...update }
    }

    selectedStore.set(updated)

    const { concept: conceptName } = update
    const selectedConcept = taxonomy.concepts[conceptName]

    if (!!selectedConcept && !selectedConcept.children) {
      updateTaxonomy(conceptName).then(() => {
        setSelected(updated)
      })
    } else {
      setSelected(updated)
    }
  }

  useEffect(() => {
    if (!!taxonomy) {
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
    <SelectedContext value={{ selected, updateSelected }}>
      {children}
    </SelectedContext>
  )
}

export default SelectedProvider
