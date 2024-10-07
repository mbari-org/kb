import { useEffect, useState } from "react"

import { RichTreeView } from "@mui/x-tree-view/RichTreeView"
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2"

import { createRootItem, findItem } from "./taxonomyItem"

const TaxonomyTree = ({ concept, selectConcept, taxonomy }) => {
  const [rootItem, setRootItem] = useState(null)
  const [selectedItem, setSelectedItem] = useState([])
  const [expandedItems, setExpandedItems] = useState([])

  const handleSelectConcept = (_event, itemId, _isSelected) => {
    if (itemId !== concept.name) {
      selectConcept(itemId)
    }
  }

  const handleToggleConcept = (_event, itemId, isExpanded) => {
    const selectedConcept = taxonomy[itemId]
  }

  useEffect(() => {
    if (!!concept) {
      const treeRootItem = createRootItem(taxonomy)
      setRootItem(treeRootItem)
      const item = findItem(treeRootItem, concept.name)
      setSelectedItem(item)
    }
  }, [concept, taxonomy])

  if (!rootItem) {
    return null
  }

  return (
    <aside className="taxonomy-tree">
      <RichTreeView
        items={[rootItem]}
        onItemClick={handleSelectConcept}
        selectedItems={selectedItem ? [selectedItem] : []}
        onItemExpansionToggle={handleToggleConcept}
        slots={{ item: TreeItem2 }}
      />
    </aside>
  )
}

export default TaxonomyTree
