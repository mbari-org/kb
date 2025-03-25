import { use, useCallback, useMemo, useState } from 'react'

import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks'

import ConceptTreeItem from './ConceptTreeItem'

import { itemConceptLabel, itemConceptName } from './lib/taxonomyItem'

import useArrowKeys from './lib/useArrowKeys'
import useConceptAutoExpand from './lib/useConceptAutoExpand'
import useConceptClick from './lib/useConceptClick'
import useExpandConcept from './lib/useExpandConcept'
import useTaxonomyTreeReposition from './lib/useTaxonomyTreeReposition'

import ConceptContext from '@/contexts/concept/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const TaxonomyTree = ({ autoExpand, setAutoExpand, sidebarRef }) => {
  const { concept } = use(ConceptContext)
  const { selectConcept: updateSelectedConcept } = use(SelectedContext)
  const { getConcept, getConceptPrimaryName, getRoot, taxonomy } = use(TaxonomyContext)

  const [expandedItems, setExpandedItems] = useState([])

  const apiRef = useTreeViewApiRef()

  const selectedItems = useMemo(() => {
    return concept ? [concept] : []
  }, [concept])

  const treeItems = useMemo(() => {
    const root = getRoot()
    return [root]
  }, [getRoot])

  const slots = { item: ConceptTreeItem }
  const slotProps = useMemo(() => {
    return {
      item: {
        concept,
        taxonomy,
      },
    }
  }, [concept, taxonomy])

  const selectConcept = useCallback(
    conceptName => {
      updateSelectedConcept(conceptName)
      setAutoExpand({ expand: true, name: conceptName })
    },
    [setAutoExpand, updateSelectedConcept]
  )

  const expandConcept = useExpandConcept(expandedItems, setExpandedItems, taxonomy)

  const handleConceptClick = useConceptClick(concept, expandConcept, selectConcept, setAutoExpand)

  useConceptAutoExpand({
    autoExpand,
    concept,
    expandConcept,
    getConceptPrimaryName,
    setAutoExpand,
  })
  useTaxonomyTreeReposition(apiRef, concept)

  useArrowKeys(concept, expandConcept, expandedItems, selectConcept, setAutoExpand, sidebarRef)

  if (!concept || !getConcept(concept.name)) {
    return null
  }

  return (
    <aside className='taxonomy-tree' style={{ flexGrow: 1, height: '100%' }}>
      <RichTreeView
        itemChildrenIndentation={8}
        apiRef={apiRef}
        expandedItems={expandedItems}
        getItemId={itemConceptName}
        getItemLabel={itemConceptLabel}
        items={treeItems}
        onItemClick={handleConceptClick}
        selectedItems={selectedItems}
        slots={slots}
        slotProps={slotProps}
        style={{ flexGrow: 1, height: '100%' }}
      />
    </aside>
  )
}

export default TaxonomyTree
