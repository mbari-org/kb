import { use, useEffect, useRef, useState } from "react"

import { RichTreeView } from "@mui/x-tree-view/RichTreeView"
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks"

import SelectedContext from "@/contexts/selected/SelectedContext"

import ConceptItem from "./ConceptItem"
import Expand from "./lib/expandedEnum"

import { getConceptLabel, getConceptName } from "./lib/taxonomyItem"

import useArrowNavigation from "./lib/useArrowNavigation"
import useConceptClick from "./lib/useConceptClick"
import useExpandConcept from "./lib/useExpandConcept"

const TaxonomyTree = ({ concept, taxonomy }) => {
  const { updateSelectedConcept } = use(SelectedContext)

  const [expandedItems, setExpandedItems] = useState([])
  const [autoExpand, setAutoExpand] = useState(true)

  const isExpanded = concept =>
    0 < concept.children.length && expandedItems.includes(concept.name)

  const expandConcept = useExpandConcept(
    expandedItems,
    setExpandedItems,
    taxonomy
  )

  const selectConcept = conceptName => {
    updateSelectedConcept(conceptName)
    setAutoExpand(true)
  }

  const handleConceptClick = useConceptClick(
    concept,
    expandConcept,
    selectConcept,
    setAutoExpand
  )

  const handleArrowKeys = useArrowNavigation(
    concept,
    expandConcept,
    isExpanded,
    selectConcept,
    setAutoExpand
  )

  const apiRef = useTreeViewApiRef()
  const timeoutRef = useRef(null)
  const treeRef = useRef(null)

  useEffect(() => {
    if (concept && autoExpand) {
      expandConcept(concept, Expand.ON)
      setAutoExpand(false)
    }
  }, [autoExpand, concept, expandConcept])

  useEffect(() => {
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
  }, [apiRef, concept])

  useEffect(() => {
    const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
    const handleKeyDown = event => {
      if (arrowKeys.includes(event.key)) {
        event.preventDefault()
        handleArrowKeys(event)
      }
    }
    const currentTreeRef = treeRef.current
    if (currentTreeRef) {
      currentTreeRef.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      if (currentTreeRef) {
        currentTreeRef.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [handleArrowKeys])

  if (!concept) {
    return null
  }

  const slots = {
    item: ConceptItem,
  }
  const slotProps = {
    item: {
      concept,
      taxonomy,
    },
  }

  return (
    <aside className="taxonomy-tree" ref={treeRef}>
      <RichTreeView
        itemChildrenIndentation={8}
        apiRef={apiRef}
        expandedItems={expandedItems}
        getItemId={getConceptName}
        getItemLabel={getConceptLabel}
        items={[taxonomy.root]}
        onItemClick={(_event, itemId) => handleConceptClick(itemId)}
        selectedItems={[concept]}
        slots={slots}
        slotProps={slotProps}
      />
    </aside>
  )
}

export default TaxonomyTree
