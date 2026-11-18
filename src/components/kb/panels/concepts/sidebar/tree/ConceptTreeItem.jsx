import { forwardRef, memo, useSyncExternalStore } from 'react'

import Collapse from '@mui/material/Collapse'
import { TreeItemProvider, TreeItem } from '@mui/x-tree-view'

import ConceptTreeLabel from './ConceptTreeLabel'

import { isCollapseAnimating, subscribeCollapseAnimating } from './lib/collapseAnimationStore'

const InstantGroupTransition = ({ children, className, in: expanded }) =>
  expanded ? (
    <ul className={className} role='group'>
      {children}
    </ul>
  ) : null

const ConceptTreeItem = forwardRef(function ConceptItem(props, ref) {
  const { itemId } = props
  const transition = useSyncExternalStore(subscribeCollapseAnimating, () => isCollapseAnimating(itemId))

  return (
    <TreeItemProvider itemId={itemId}>
      <TreeItem
        {...props}
        ref={ref}
        slotProps={{ label: { itemId } }}
        slots={{
          groupTransition: transition ? Collapse : InstantGroupTransition,
          label: ConceptTreeLabel,
        }}
      />
    </TreeItemProvider>
  )
})

export default memo(ConceptTreeItem)
