import { forwardRef, memo } from 'react'

import { TreeItemProvider, TreeItem } from '@mui/x-tree-view'

import ConceptTreeLabel from './ConceptTreeLabel'
import ConceptsExpand from './ConceptsExpand'

const ConceptTreeItem = forwardRef(function ConceptItem(props, ref) {
  const { itemId } = props

  return (
    <TreeItemProvider itemId={itemId}>
      <TreeItem
        {...props}
        ref={ref}
        slotProps={{
          label: { itemId },
        }}
        slots={{
          groupTransition: ConceptsExpand,
          label: ConceptTreeLabel,
        }}
      />
    </TreeItemProvider>
  )
})

export default memo(ConceptTreeItem)
