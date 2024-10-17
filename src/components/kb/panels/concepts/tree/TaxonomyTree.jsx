import { useCallback, useEffect, useRef, useState } from "react"

import { RichTreeView } from "@mui/x-tree-view/RichTreeView"

import ConceptItem from "./ConceptItem"

import { getConceptLabel, getConceptName, getConceptPath } from "./taxonomyItem"
import { handleArrowNav, handleSelectConcept } from "./handleTreeEvents"

import { useTreeViewApiRef } from "@mui/x-tree-view/hooks"

const TaxonomyTree = ({ concept, selectConcept, taxonomy }) => {
  const [expandedItems, setExpandedItems] = useState([])
  const [autoExpand, setAutoExpand] = useState(true)

  const apiRef = useTreeViewApiRef()
  const timeoutRef = useRef(null)

  const expandConcept = useCallback(
    (concept, expand = true) => {
      if (expand && !expandedItems.includes(concept.name)) {
        setExpandedItems([...expandedItems, concept.name])
      }
      if (!expand && expandedItems.includes(concept.name)) {
        setExpandedItems(expandedItems.filter(id => id !== concept.name))
      }
    },
    [expandedItems]
  )

  const allLeafs = (concept, leafs = []) => {
    if (concept.children && 0 < concept.children.length) {
      leafs.push(concept.name)
      concept.children.forEach(child => allLeafs(child, leafs))
    }
    return leafs
  }

  const expandAllChildren = (concept, expand = true) => {
    const leafs = allLeafs(concept)
    if (expand) {
      setExpandedItems(prevItems => [...new Set([...prevItems, ...leafs])])
    } else {
      const trimmedItems = expandedItems.filter(item => !leafs.includes(item))
      setExpandedItems([...trimmedItems, concept.name])
    }
  }

  const handleConceptClick = (event, itemId) =>
    handleSelectConcept(
      concept,
      expandConcept,
      expandedItems,
      itemId,
      selectConcept,
      setAutoExpand
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
    const handleArrowKeys = event => {
      if (arrowKeys.includes(event.key)) {
        event.preventDefault()
        handleArrowNav(
          concept,
          event,
          expandAllChildren,
          expandConcept,
          expandedItems,
          selectConcept,
          setAutoExpand
        )
      }
    }

    window.addEventListener("keydown", handleArrowKeys)

    return () => {
      window.removeEventListener("keydown", handleArrowKeys)
    }
  }, [concept, expandedItems, selectConcept, setExpandedItems, taxonomy])

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
        onItemClick={handleConceptClick}
        selectedItems={[concept]}
        slotProps={slotProps}
        slots={{ item: ConceptItem }}
      />
    </aside>
  )
}

export default TaxonomyTree
