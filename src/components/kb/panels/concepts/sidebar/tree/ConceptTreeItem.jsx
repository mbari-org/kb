import { forwardRef, memo } from 'react'

import Collapse from '@mui/material/Collapse'
import { TreeItemProvider, TreeItem } from '@mui/x-tree-view'

import ConceptTreeLabel from './ConceptTreeLabel'

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
          groupTransition: Collapse,
          label: ConceptTreeLabel,
        }}
      />
    </TreeItemProvider>
  )
})

export default memo(ConceptTreeItem)
