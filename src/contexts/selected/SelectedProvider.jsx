import { use, useEffect, useState } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import selectedStore from '@/lib/store/selected'

import panels from '@/lib/kb/panels'

const SelectedProvider = ({ children }) => {
  const { taxonomy } = use(TaxonomyContext)

  const [selected, setSelected] = useState(null)

  const updateSelected = update => {
    const updated = selected ? { ...selected, ...update } : update
    selectedStore.set(updated)
    setSelected(updated)
  }

  const selectPanel = panel => {
    if (panel !== selected.panel) {
      updateSelected({ panel })
    }
  }

  const selectConcept = conceptName => {
    if (conceptName !== selected.concept) {
      updateSelected({ concept: conceptName })
    }
  }

  useEffect(() => {
    if (taxonomy) {
      const storedSelected = selectedStore.get()
      const concept = taxonomy.names.includes(storedSelected?.concept)
        ? storedSelected.concept
        : taxonomy.rootName
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
    <SelectedContext value={{ selected, selectConcept, selectPanel }}>{children}</SelectedContext>
  )
}

export default SelectedProvider
