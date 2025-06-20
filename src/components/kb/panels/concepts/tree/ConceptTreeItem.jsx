import { forwardRef } from 'react'

import { TreeItemProvider, TreeItem } from '@mui/x-tree-view'

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
    <TreeItemProvider itemId={itemId}>
      <TreeItem
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
    </TreeItemProvider>
  )
})

export default ConceptTreeItem
