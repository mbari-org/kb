import { use, forwardRef } from 'react'

import { TreeItem2Provider } from '@mui/x-tree-view'
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2'

import ConceptContent from './ConceptContent'
import ConceptLabel from './ConceptLabel'
import ConceptsExpand from './ConceptsExpand'

import ConceptContext from '@/contexts/concept/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { hasPendingHistory } from '@/lib/kb/util/pendingHistory'

const ConceptItem = forwardRef(function ConceptItem(props, ref) {
  const { concept } = use(ConceptContext)
  const { getConcept, getConceptPendingHistory } = use(TaxonomyContext)

  const { itemId } = props
  const isSelected = itemId === concept.name

  const item = getConcept(itemId)
  if (!item) {
    return null
  }

  const itemHasPendingHistory = hasPendingHistory(getConceptPendingHistory(item.name))

  const mediaCount = item.media.length
  const hasMedia = 0 < mediaCount

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2
        {...props}
        ref={ref}
        slotProps={{
          content: { isSelected },
          label: {
            hasPendingHistory: itemHasPendingHistory,
            hasMedia,
            isSelected,
            mediaCount,
          },
        }}
        slots={{
          content: ConceptContent,
          groupTransition: ConceptsExpand,
          label: ConceptLabel,
        }}
      />
    </TreeItem2Provider>
  )
})

export default ConceptItem
