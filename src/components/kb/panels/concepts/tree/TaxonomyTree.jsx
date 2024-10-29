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

const TaxonomyTree = ({
  autoExpand,
  concept,
  setAutoExpand,
  sidebarRef,
  taxonomy,
}) => {
  const { updateSelectedConcept } = use(SelectedContext)

  const [expandedItems, setExpandedItems] = useState([])

  const isExpanded = concept =>
    0 < concept.children.length && expandedItems.includes(concept.name)

  const expandConcept = useExpandConcept(
    expandedItems,
    setExpandedItems,
    taxonomy
  )

  const selectConcept = conceptName => {
    updateSelectedConcept(conceptName)
    setAutoExpand({ expand: true, name: conceptName })
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

  useEffect(() => {
    // Expand concept on initial load
    if (concept && autoExpand === null) {
      setAutoExpand({ expand: true, name: concept.name })
    } else if (
      concept &&
      autoExpand.expand &&
      autoExpand.name === concept.name
    ) {
      expandConcept(concept, Expand.ON)
      setAutoExpand({ expand: false, name: null })
    }
  }, [autoExpand, concept, expandConcept, expandedItems, setAutoExpand])

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
    const currentSidebar = sidebarRef.current
    if (currentSidebar) {
      currentSidebar.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      if (currentSidebar) {
        currentSidebar.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [handleArrowKeys, sidebarRef])

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
    <aside className="taxonomy-tree" style={{ flexGrow: 1, height: "100%" }}>
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
        style={{ flexGrow: 1, height: "100%" }}
      />
    </aside>
  )
}

export default TaxonomyTree
