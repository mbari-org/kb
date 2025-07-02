import { use, useCallback, useMemo, useState, memo } from 'react'

import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks'

import ConceptTreeItem from './ConceptTreeItem'

import useArrowKeys from './lib/useArrowKeys'
import useConceptAutoExpand from './lib/useConceptAutoExpand'
import useConceptClick from './lib/useConceptClick'
import useExpandConcept from './lib/useExpandConcept'
import useTaxonomyTreeReposition from './lib/useTaxonomyTreeReposition'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { conceptItem } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'
import { buildTree } from '@/lib/kb/model/taxonomy'
import { SELECTED } from '@/lib/constants'

const ConceptsTree = ({ autoExpand, setAutoExpand, sidebarRef }) => {
  const { concept } = use(ConceptContext)
  const { updateSelected } = use(SelectedContext)
  const { getConcept, getConceptPrimaryName, taxonomy } = use(TaxonomyContext)

  const [expandedItems, setExpandedItems] = useState([])

  const apiRef = useTreeViewApiRef()

  const selectedItems = useMemo(() => {
    return concept?.name ? [concept.name] : []
  }, [concept?.name])

  const treeItems = useMemo(() => {
    const root = buildTree(taxonomy)
    return [root]
  }, [taxonomy])

  // The slots 'item' field designates the rendering component, but only the itemId is provided,
  //  not the item itself. The slotsProps 'item' field, passed to ConceptTreeItem in props,
  //  provides display data.
  const slots = useMemo(() => ({ item: ConceptTreeItem }), [])
  
  const selectedConceptName = concept?.name
  const slotProps = useMemo(() => ({
    item: ({ itemId }) => {
      const item = conceptItem(taxonomy, itemId)
      return { 
        item: {
          ...item,
          isSelected: itemId === selectedConceptName
        }
      }
    },
  }), [taxonomy, selectedConceptName])

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
  useTaxonomyTreeReposition(apiRef, concept)

  useArrowKeys(
    concept,
    expandConcept,
    expandedItems,
    getConcept,
    handleConceptSelect,
    setAutoExpand,
    sidebarRef
  )

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
