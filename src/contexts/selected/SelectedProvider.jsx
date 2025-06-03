import { use, useEffect, useState } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import selectedStore from '@/lib/store/selected'
import { SELECTED } from '@/lib/constants'

import panels from '@/components/kb/panels/panels'

const SelectedProvider = ({ children }) => {
  const { taxonomy } = use(TaxonomyContext)

  const [selected, setSelected] = useState(null)

  const select = ({ concept, panel, history, byConcept }) => {
    const updated = {
      concept: concept || selected?.concept,
      panel: panel || selected?.panel,
      history: history ? { type: history } : selected?.history,
      byConcept: byConcept !== undefined ? byConcept : selected?.byConcept,
    }
    selectedStore.set(updated)
    setSelected(updated)
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
      const history = storedSelected?.history || { type: SELECTED.HISTORY.TYPE.PENDING }
      const byConcept = storedSelected?.byConcept || false
      const initialSelected = { concept, panel, history, byConcept }
      selectedStore.set(initialSelected)
      setSelected(initialSelected)
    }
  }, [taxonomy])

  if (!selected) {
    return null
  }

  return <SelectedContext value={{ select, selected }}>{children}</SelectedContext>
}

export default SelectedProvider
