import { forwardRef } from "react"

import { TreeItem2Provider } from "@mui/x-tree-view"
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2"

import ConceptContent from "./ConceptContent"
import ConceptLabel from "./ConceptLabel"
import ConceptsExpand from "./ConceptsExpand"

const ConceptItem = forwardRef(function ConceptItem(props, ref) {
  const { concept, itemId, taxonomy } = props
  const isSelected = itemId === concept.name

  const pendingHistory =
    taxonomy.pendingHistory.find(history => itemId === history.concept) ||
    itemId === "data file"
  const hasPendingHistory = pendingHistory ? true : false

  const itemConcept = taxonomy.concepts[itemId]
  const hasMedia = 0 < itemConcept.media.length

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2
        {...props}
        ref={ref}
        slotProps={{
          content: { isSelected },
          label: { hasPendingHistory, hasMedia, isSelected },
        }}
        slots={{
          content: ConceptContent,
          groupTransition: ConceptsExpand,
          label: ConceptLabel,
        }}
      />
    </TreeItem2Provider>
  )
})

export default ConceptItem
