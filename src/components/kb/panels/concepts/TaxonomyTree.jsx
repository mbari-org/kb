import { useEffect, useState } from "react"

import { RichTreeView } from "@mui/x-tree-view/RichTreeView"
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2"

import treeItems from "./treeIItems"

const TaxonomyTree = ({ concept, selectConcept, taxonomy }) => {
  const [items, setItems] = useState(null)

  const handleSelectConcept = (_event, itemId, _isSelected) => {
    if (itemId !== concept.name) {
      selectConcept(itemId)
    }
  }

  const handleToggleConcept = (_event, itemId, isExpanded) => {
    const selectedConcept = taxonomy[itemId]
  }

  useEffect(() => {
    setItems(treeItems(taxonomy))
  }, [taxonomy])

  if (!items) {
    return null
  }

  return (
    <aside className="taxonomy-tree">
      <RichTreeView
        items={items}
        onItemClick={handleSelectConcept}
        onItemExpansionToggle={handleToggleConcept}
        slots={{ item: TreeItem2 }}
      />
    </aside>
  )
}

export default TaxonomyTree
