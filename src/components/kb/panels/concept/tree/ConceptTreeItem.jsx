import { forwardRef } from 'react'

import { TreeItem2Provider } from '@mui/x-tree-view'
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2'

import ConceptTreeLabel from './ConceptTreeLabel'
import ConceptsExpand from './ConceptsExpand'
import ConceptTreeItemContent from './ConceptTreeItemContent'

const ConceptTreeItem = forwardRef(function ConceptItem(props, ref) {
  const { item, itemId } = props

  if (!item) {
    return null
  }

  const mediaCount = item.mediaCount || 0
  const hasMedia = mediaCount > 0

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2
        {...props}
        ref={ref}
        slotProps={{
          content: { isSelected: item.isSelected },
          label: {
            hasMedia,
            hasPending: item.hasPending,
            isSelected: item.isSelected,
            mediaCount,
          },
        }}
        slots={{
          content: ConceptTreeItemContent,
          groupTransition: ConceptsExpand,
          label: ConceptTreeLabel,
        }}
      />
    </TreeItem2Provider>
  )
})

export default ConceptTreeItem
