import { use, useCallback, useMemo, useState } from 'react'

import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks'

import ConceptTreeItem from './ConceptTreeItem'

import useArrowKeys from './lib/useArrowKeys'
import useConceptAutoExpand from './lib/useConceptAutoExpand'
import useConceptClick from './lib/useConceptClick'
import useExpandConcept from './lib/useExpandConcept'
import useTaxonomyTreeReposition from './lib/useTaxonomyTreeReposition'

import ConceptContext from '@/contexts/concept/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { conceptItem } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'
import { buildTree } from '@/lib/kb/model/taxonomy'

const TaxonomyTree = ({ autoExpand, setAutoExpand, sidebarRef }) => {
  const { concept } = use(ConceptContext)
  const { select } = use(SelectedContext)
  const { getConcept, getConceptPrimaryName, taxonomy } = use(TaxonomyContext)

  const [expandedItems, setExpandedItems] = useState([])

  const apiRef = useTreeViewApiRef()

  const selectedItems = useMemo(() => {
    return concept ? [concept] : []
  }, [concept])

  const treeItems = useMemo(() => {
    const root = buildTree(taxonomy)
    return [root]
  }, [taxonomy])

  // The RichTreeView item is not provided to the ConceptTreeItem component. The slots 'item'
  //  field designates the rendering component, but only the itemId is provided to that component.
  //  The slotsProps 'item' field, passed to ConceptTreeItem in props, provides display data.
  const slots = { item: ConceptTreeItem }
  const slotProps = {
    item: ({ itemId }) => {
      const item = conceptItem(taxonomy, itemId)
      item.isSelected = itemId === concept.name
      return { item }
    },
  }

  const selectConcept = useCallback(
    conceptName => {
      select({ concept: conceptName })
      setAutoExpand({ expand: true, name: conceptName })
    },
    [select, setAutoExpand]
  )

  const expandConcept = useExpandConcept(expandedItems, setExpandedItems, taxonomy)

  const handleItemClick = useConceptClick(concept, expandConcept, selectConcept, setAutoExpand)

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
    selectConcept,
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
        getItemId={item => item.id}
        itemChildrenIndentation={12}
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

export default TaxonomyTree
