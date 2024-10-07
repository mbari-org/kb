import { useEffect, useState } from "react"

import { RichTreeView } from "@mui/x-tree-view/RichTreeView"
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2"

import { createRootItem, findItem } from "./taxonomyItem"

const TaxonomyTree = ({ concept, selectConcept, taxonomy }) => {
  const [rootItem, setRootItem] = useState(null)
  const [selectedItem, setSelectedItem] = useState([])
  const [expandedItems, setExpandedItems] = useState([])

  const handleSelectConcept = (_event, itemId) => {
    if (itemId === concept.name) {
      if (0 < concept.children.length) {
        if (expandedItems.includes(itemId)) {
          setExpandedItems(expandedItems.filter(id => id !== itemId))
        } else {
          setExpandedItems([...expandedItems, itemId])
        }
      }
    } else {
      selectConcept(itemId)
    }
  }

  useEffect(() => {
    if (!!concept) {
      const treeRootItem = createRootItem(taxonomy)
      setRootItem(treeRootItem)
      const { item, path } = findItem(treeRootItem, concept.name)
      setSelectedItem(item)

      console.log(`Set expanded items: [${path.join(", ")}]`)

      setExpandedItems(path)
    }
  }, [concept, taxonomy])

  if (!rootItem) {
    return null
  }

  return (
    <aside className="taxonomy-tree">
      <RichTreeView
        expandedItems={expandedItems}
        items={[rootItem]}
        onItemClick={handleSelectConcept}
        selectedItems={selectedItem ? [selectedItem] : []}
        slots={{ item: TreeItem2 }}
      />
    </aside>
  )
}

export default TaxonomyTree
