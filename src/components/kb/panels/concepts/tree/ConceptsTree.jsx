import { use, useCallback, useEffect, useMemo, useState, memo } from 'react'

import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks'

import ConceptTreeItem from '@/components/kb/panels/concepts/tree/ConceptTreeItem'

import useArrowKeys from '@/components/kb/panels/concepts/tree/lib/useArrowKeys'
import useConceptAutoExpand from '@/components/kb/panels/concepts/tree/lib/useConceptAutoExpand'
import useConceptClick from '@/components/kb/panels/concepts/tree/lib/useConceptClick'
import useExpandConcept from '@/components/kb/panels/concepts/tree/lib/useExpandConcept'
import useConceptsTreeScroll from '@/components/kb/panels/concepts/tree/lib/useConceptsTreeScroll'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useConceptItem from '@/components/kb/panels/concepts/tree/lib/useConceptItem'
import { buildTree } from '@/lib/model/taxonomy'
import { SELECTED } from '@/lib/constants/selected.js'

const ConceptsTree = ({ autoExpand, setAutoExpand, sidebarRef }) => {
  const { concept, conceptPath, onConceptTreeReady } = use(ConceptContext)
  const { updateSelected } = use(SelectedContext)
  const { getConcept, getConceptPrimaryName, taxonomy } = use(TaxonomyContext)

  const [expandedItems, setExpandedItems] = useState([])

  const apiRef = useTreeViewApiRef()
  const conceptName = concept?.name

  const selectedItems = useMemo(() => {
    return conceptName ? [conceptName] : []
  }, [conceptName])

  const treeItems = useMemo(() => {
    const root = buildTree(taxonomy)
    return [root]
  }, [taxonomy])

  const createConceptItem = useConceptItem()

  // The slots 'item' field designates the rendering component, but only the itemId is provided,
  //  not the item itself. The slotsProps 'item' field, passed to ConceptTreeItem in props,
  //  provides display data.
  const slots = useMemo(() => ({ item: ConceptTreeItem }), [])

  const selectedConceptName = concept?.name
  const slotProps = useMemo(() => ({
    item: ({ itemId }) => {
      const item = createConceptItem(taxonomy, itemId)
      return {
        item: {
          ...item,
          isSelected: itemId === selectedConceptName,
        },
      }
    },
  }), [taxonomy, selectedConceptName, createConceptItem])

  const handleConceptSelect = useCallback(
    conceptName => {
      updateSelected({ [SELECTED.CONCEPT]: conceptName })
    },
    [updateSelected]
  )

  const expandConcept = useExpandConcept(expandedItems, setExpandedItems, taxonomy)

  const getItemId = useCallback(item => item.id, [])

  const handleItemClick = useConceptClick(
    concept,
    expandConcept,
    handleConceptSelect,
    setAutoExpand
  )

  useConceptAutoExpand({
    autoExpand,
    concept,
    expandConcept,
    getConceptPrimaryName,
    setAutoExpand,
  })

  useArrowKeys(
    concept,
    expandConcept,
    expandedItems,
    getConcept,
    handleConceptSelect,
    setAutoExpand,
    sidebarRef
  )

  const { needsToScroll, scrollToNode } = useConceptsTreeScroll(apiRef, concept, sidebarRef)

  useEffect(() => {
    if (conceptPath && conceptPath.length > 0) {
      const timeoutId = setTimeout(() => {
        setExpandedItems(prev => [...new Set([...prev, ...conceptPath])])
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [conceptPath])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      needsToScroll() ? scrollToNode(() => onConceptTreeReady()) : onConceptTreeReady()
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [needsToScroll, scrollToNode, onConceptTreeReady])

  if (!concept || !getConcept(concept.name)) {
    return null
  }

  return (
    <aside className='taxonomy-tree' style={{ flexGrow: 1, height: '100%' }}>
      <RichTreeView
        apiRef={apiRef}
        expandedItems={expandedItems}
        getItemId={getItemId}
        itemChildrenIndentation={8}
        items={treeItems}
        onItemClick={handleItemClick}
        selectedItems={selectedItems}
        slotProps={slotProps}
        slots={slots}
        style={{ flexGrow: 1, height: '100%' }}
      />
    </aside>
  )
}

export default memo(ConceptsTree)
