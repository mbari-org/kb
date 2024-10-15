import { useEffect, useState } from "react"

import { RichTreeView } from "@mui/x-tree-view/RichTreeView"
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2"

import ConceptExpand from "./ConceptExpand"
import { getConceptLabel, getConceptName, getConceptPath } from "./taxonomyItem"

import { useTreeViewApiRef } from "@mui/x-tree-view/hooks"

const TaxonomyTree = ({ concept, selectConcept, taxonomy }) => {
  const [expandedItems, setExpandedItems] = useState([])

  const apiRef = useTreeViewApiRef()

  const getItemId = concept => concept.name
  const getItemLabel = concept =>
    concept.alternateNames.length === 0
      ? concept.name
      : `${concept.name} (${concept.alternateNames.join(", ")})}`

  const handleSelectConcept = (_event, itemId) => {
    if (itemId === concept.name) {
      if (0 < concept.children?.length) {
        if (expandedItems.includes(itemId)) {
          setExpandedItems(expandedItems.filter(id => id !== itemId))
        } else {
          setExpandedItems([...expandedItems, itemId])
        }
      } else {
        selectConcept(itemId)
      }
    } else {
      const selectingConcept = taxonomy.concepts[itemId]
      if (0 < selectingConcept.children?.length) {
        setExpandedItems(expandedItems.filter(id => id !== itemId))
      }
      selectConcept(itemId)
    }
  }

  useEffect(() => {
    if (concept) {
      const path = getConceptPath(taxonomy, concept)
      setExpandedItems(path)

      // Scroll and focused item after a short delay to allow tree expansion
      setTimeout(() => {
        apiRef.current
          .getItemDOMElement(concept.name)
          ?.scrollIntoView({ behavior: "smooth", block: "center" })

        apiRef.current?.focusItem(null, concept.name)
      }, 500)
    }
  }, [concept, taxonomy])

  if (!concept) {
    return null
  }

  return (
    <aside className="taxonomy-tree">
      <RichTreeView
        apiRef={apiRef}
        expandedItems={expandedItems}
        getItemId={getConceptName}
        getItemLabel={getConceptLabel}
        items={[taxonomy.root]}
        onItemClick={handleSelectConcept}
        selectedItems={[concept]}
        slotProps={{ item: { slots: { groupTransition: ConceptExpand } } }}
        slots={{ item: TreeItem2 }}
      />
    </aside>
  )
}

export default TaxonomyTree
