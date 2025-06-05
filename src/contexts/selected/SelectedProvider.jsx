import { use, useEffect, useState } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import selectedStore from '@/lib/store/selected'
import useSelectedPanel from '@/contexts/selected/useSelectedPanel'

import { SELECTED } from '@/lib/constants'

const SelectedProvider = ({ children }) => {
  const { getRoot } = use(TaxonomyContext)

  const [selected, setSelected] = useState(null)

  const panel = useSelectedPanel()

  const select = ({ byConcept, concept, history }) => {
    const updated = {
      concept: concept ?? selected?.concept,
      history: history ? { type: history } : selected?.history,
      byConcept: byConcept !== undefined ? byConcept : selected?.byConcept,
    }
    selectedStore.set(updated)
    setSelected(updated)
  }

  useEffect(() => {
    const storedSelected = selectedStore.get()

    const byConcept = storedSelected?.byConcept || false
    const concept = storedSelected?.concept || getRoot().name
    const history = storedSelected?.history || { type: SELECTED.HISTORY.TYPE.PENDING }

    const initialValue = { concept, history, byConcept }

    selectedStore.set(initialValue)
    setSelected(initialValue)
  }, [getRoot])

  if (!selected) {
    return null
  }

  return <SelectedContext value={{ panel, select, selected }}>{children}</SelectedContext>
}

export default SelectedProvider
