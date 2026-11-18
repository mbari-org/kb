import { forwardRef, memo } from 'react'

import Collapse from '@mui/material/Collapse'
import { TreeItemProvider, TreeItem } from '@mui/x-tree-view'

import ConceptTreeLabel from './ConceptTreeLabel'

const InstantGroupTransition = ({ children, className, in: expanded }) =>
  expanded ? (
    <ul className={className} role='group'>
      {children}
    </ul>
  ) : null

const ConceptTreeItem = forwardRef(function ConceptItem({ transition = true, ...props }, ref) {
  const { itemId } = props

  return (
    <TreeItemProvider itemId={itemId}>
      <TreeItem
        {...props}
        ref={ref}
        slotProps={{
          ...(transition ? {} : { groupTransition: { timeout: 0 } }),
          label: { itemId },
        }}
        slots={{
          groupTransition: transition ? Collapse : InstantGroupTransition,
          label: ConceptTreeLabel,
        }}
      />
    </TreeItemProvider>
  )
})

export default memo(ConceptTreeItem)
