import { use } from 'react'
import { useTheme } from '@mui/material/styles'

import useHierarchyChoices from '@/components/kb/panels/concepts/concept/change/staged/hierarchy/useHierarchyChoices'
import useConceptItem from '@/components/kb/panels/concepts/sidebar/tree/lib/useConceptItem'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { ACTION } from '@/lib/constants'
import { hasPendingHierarchy } from '@/lib/model/history'

const useConceptNameColor = () => {
  const theme = useTheme()
  const { concept, pending } = use(ConceptContext)
  const treeItem = useConceptItem(concept.name)
  const { hasStagedChildren, hasStagedDelete, hasStagedName, hasStagedParent } = useHierarchyChoices()
  const hasStagedHierarchy = hasStagedChildren || hasStagedDelete || hasStagedName || hasStagedParent
  const hasPending = hasPendingHierarchy(pending, concept.name)

  const color = treeItem?.pendingAction === ACTION.ADD
    ? theme.concept.color.add
    : treeItem?.pendingAction === ACTION.DELETE
      ? theme.concept.color.remove
      : hasStagedHierarchy || hasPending.any
        ? theme.concept.color.edit
        : theme.palette.primary.main

  return { color, hasStagedDelete }
}

export default useConceptNameColor
