import { useEffect, useRef, useState } from "react"

import { RichTreeView } from "@mui/x-tree-view/RichTreeView"
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks"

import ConceptItem from "./ConceptItem"

import {
  getConceptLabel,
  getConceptName,
  getConceptPath,
} from "./lib/taxonomyItem"

import useArrowNavigation from "./lib/useArrowNavigation"
import useExpandConcept from "./lib/useExpandConcept"
import useSelectConcept from "./lib/useSelectConcept"

const TaxonomyTree = ({ concept, selectConcept, taxonomy }) => {
  const [expandedItems, setExpandedItems] = useState([])
  const [autoExpand, setAutoExpand] = useState(true)

  const apiRef = useTreeViewApiRef()
  const timeoutRef = useRef(null)

  const expandConcept = useExpandConcept(
    expandedItems,
    setExpandedItems,
    taxonomy
  )

  const handleSelectConcept = useSelectConcept(
    concept,
    expandConcept,
    expandedItems,
    selectConcept,
    setAutoExpand
  )

  const handleArrowKeys = useArrowNavigation(
    concept,
    expandConcept,
    expandedItems,
    selectConcept,
    setAutoExpand,
    setExpandedItems,
    taxonomy
  )

  useEffect(() => {
    if (concept) {
      if (expandedItems.length === 0) {
        setExpandedItems(getConceptPath(taxonomy, concept))
      } else {
        expandConcept(concept, autoExpand)
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Scroll and focused item after a short delay to allow tree expansion
      timeoutRef.current = setTimeout(() => {
        const domElement = apiRef.current.getItemDOMElement(concept.name)
        if (!domElement) {
          return
        }
        const rect = domElement.getBoundingClientRect()
        const conceptIsVisible =
          rect.top >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight)
        if (!conceptIsVisible) {
          domElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
          apiRef.current.focusItem(null, concept.name)
        }
      }, 500)
    }
  }, [concept, taxonomy])

  useEffect(() => {
    const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
    const handleKeyDown = event => {
      if (arrowKeys.includes(event.key)) {
        event.preventDefault()
        handleArrowKeys(event)
      }
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleArrowKeys])

  if (!concept) {
    return null
  }

  const slotProps = {
    item: {
      concept,
    },
  }

  return (
    <aside className="taxonomy-tree">
      <RichTreeView
        itemChildrenIndentation={8}
        apiRef={apiRef}
        expandedItems={expandedItems}
        getItemId={getConceptName}
        getItemLabel={getConceptLabel}
        items={[taxonomy.root]}
        onItemClick={(_event, itemId) => handleSelectConcept(itemId)}
        selectedItems={[concept]}
        slotProps={slotProps}
        slots={{ item: ConceptItem }}
      />
    </aside>
  )
}

export default TaxonomyTree
