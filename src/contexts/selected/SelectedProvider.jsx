import { use, useEffect, useState } from "react"

import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"
import SelectedContext from "./SelectedContext"

import selectedStore from "@/lib/store/selected"

const SelectedProvider = ({ children }) => {
  const { taxonomy } = use(TaxonomyContext)

  const [selected, setSelected] = useState(null)

  const updateSelected = update => {
    if (selected === null) {
      setSelected(update)
    } else if (JSON.stringify(update) !== JSON.stringify(selected)) {
      const updated = { ...selected, ...update }
      selectedStore.set(updated)
      setSelected(updated)
    }
  }

  useEffect(() => {
    if (!!taxonomy) {
      const initialSelected = selectedStore.get() || {
        concept: taxonomy._root_,
        panel: "Concepts",
      }
      setSelected(initialSelected)
    }
  }, [taxonomy])

  return (
    <SelectedContext value={{ selected, updateSelected }}>
      {children}
    </SelectedContext>
  )
}

export default SelectedProvider
