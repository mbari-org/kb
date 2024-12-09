import { use, useCallback, useState } from "react"

import { RichTreeView } from "@mui/x-tree-view/RichTreeView"
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks"

import ConceptItem from "./ConceptItem"

import { itemConceptLabel, itemConceptName } from "./lib/taxonomyItem"

import useArrowKeys from "./lib/useArrowKeys"
import useConceptAutoExpand from "./lib/useConceptAutoExpand"
import useConceptClick from "./lib/useConceptClick"
import useExpandConcept from "./lib/useExpandConcept"
import useTaxonomyTreeReposition from "./lib/useTaxonomyTreeReposition"

import ConceptContext from "@/contexts/concept/ConceptContext"
import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const TaxonomyTree = ({ autoExpand, setAutoExpand, sidebarRef }) => {
  const { concept } = use(ConceptContext)
  const { selectConcept: updateSelectedConcept } = use(SelectedContext)
  const { taxonomy } = use(TaxonomyContext)

  const [expandedItems, setExpandedItems] = useState([])

  const apiRef = useTreeViewApiRef()

  const selectConcept = useCallback(
    conceptName => {
      updateSelectedConcept(conceptName)
      setAutoExpand({ expand: true, name: conceptName })
    },
    [setAutoExpand, updateSelectedConcept]
  )

  const expandConcept = useExpandConcept(expandedItems, setExpandedItems)

  const handleConceptClick = useConceptClick(
    concept,
    expandConcept,
    selectConcept,
    setAutoExpand
  )

  useConceptAutoExpand(concept, autoExpand, setAutoExpand, expandConcept)
  useTaxonomyTreeReposition(apiRef, concept)

  useArrowKeys(
    concept,
    expandConcept,
    expandedItems,
    selectConcept,
    setAutoExpand,
    sidebarRef
  )

  if (!concept) {
    return null
  }

  return (
    <aside className="taxonomy-tree" style={{ flexGrow: 1, height: "100%" }}>
      <RichTreeView
        itemChildrenIndentation={8}
        apiRef={apiRef}
        expandedItems={expandedItems}
        getItemId={itemConceptName}
        getItemLabel={itemConceptLabel}
        items={[taxonomy.root]}
        onItemClick={handleConceptClick}
        selectedItems={[concept]}
        slots={{ item: ConceptItem }}
        slotProps={{
          item: {
            concept,
            taxonomy,
          },
        }}
        style={{ flexGrow: 1, height: "100%" }}
      />
    </aside>
  )
}

export default TaxonomyTree
