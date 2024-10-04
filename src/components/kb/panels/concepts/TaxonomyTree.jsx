import { use, useEffect, useState } from "react"

import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

import { RichTreeView } from "@mui/x-tree-view/RichTreeView"
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2"

// import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import treeItems from "./treeIItems"
import { CheckBoxOutlined } from "@mui/icons-material"

const TaxonomyTree = ({ concept, selectConcept, taxonomy }) => {
  const [items, setItems] = useState(null)

  const handleSelectConcept = (_event, itemId, _isSelected) => {
    if (itemId !== concept.name) {
      selectConcept(itemId)
    }
  }

  const handleToggleConcept = (_event, itemId, isExpanded) => {
    const selectedConcept = taxonomy[itemId]

    console.log("CxDebug handle toggle concept:", selectedConcept)
  }

  useEffect(() => {
    console.log("CxDebug set tree using taxonomy:", taxonomy)
    setItems(treeItems(taxonomy))
  }, [taxonomy])

  if (!items) {
    return null
  }

  console.log("CxDebug render with concept:", concept)
  console.log("CxDebug    from taxonomy:", taxonomy)

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
