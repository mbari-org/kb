import { use } from "react"

import { createActions } from "@/components/kb/factory"

import ConceptContext from "@/contexts/concept/ConceptContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const ChangeNameActions = () => {
  const { concept, editingState, processUpdates } = use(ConceptContext)
  const { getConceptNames } = use(TaxonomyContext)

  const names = getConceptNames()

  const colors = ["cancel", "main", "main"]
  const disabled =
    concept.name !== editingState.name && !names.includes(editingState.name)
      ? [false, false, false]
      : [false, true, true]
  const labels = ["Cancel", "Name Only", "All Data"]

  return createActions(
    { colors, disabled, labels, onAction: processUpdates },
    "ConceptNameUpdateActions"
  )
}

export default ChangeNameActions
