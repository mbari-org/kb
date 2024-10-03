import { use, useEffect, useState } from "react"

import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

import { RichTreeView } from "@mui/x-tree-view/RichTreeView"
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2"

// import StatusContext from "@/contexts/status/StatusContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import treeItems from "./treeIItems"

const TaxonomyTree = ({ concept }) => {
  const { taxonomy, loadConcept } = use(TaxonomyContext)

  const [items, setItems] = useState(null)

  const handleSelectConcept = (_event, itemId, _isSelected) => {
    const selectedConcept = taxonomy[itemId]

    if (!selectedConcept.chilren) {
      loadConcept(selectedConcept.name)
    }
  }

  useEffect(() => {
    setItems(treeItems(taxonomy))
  }, [taxonomy])

  if (!concept) {
    return null
  }
  console.log("Render items:", items)

  return (
    <aside className="taxonomy-tree">
      <RichTreeView
        items={items}
        onItemClick={handleSelectConcept}
        slots={{ item: TreeItem2 }}
      />
    </aside>
  )
}

export default TaxonomyTree
