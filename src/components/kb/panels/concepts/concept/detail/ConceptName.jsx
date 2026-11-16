import { use, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptHierarchyIcon from '@/components/icon/ConceptHierarchyIcon'
import ConceptHierarchyChoices from '@/components/kb/panels/concepts/concept/change/staged/hierarchy/ConceptHierarchyChoices'
import DsgLink from '@/components/kb/panels/concepts/concept/detail/dsgLink/DsgLink'

import useHierarchyChoices from '@/components/kb/panels/concepts/concept/change/staged/hierarchy/useHierarchyChoices'
import useConceptItem from '@/components/kb/panels/concepts/sidebar/tree/lib/useConceptItem'

import UserContext from '@/contexts/user/UserContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { hasPendingHierarchy } from '@/lib/model/history'
import { ACTION } from '@/lib/constants'

const ConceptName = () => {
  const theme = useTheme()

  const { isReadOnly } = use(UserContext)
  const { concept, isEditing, pending } = use(ConceptContext)
  const treeItem = useConceptItem(concept.name)

  const { hasStagedChildren, hasStagedDelete, hasStagedName, hasStagedParent } = useHierarchyChoices()
  const hasStagedHierarchy = hasStagedChildren || hasStagedDelete || hasStagedName || hasStagedParent

  const [showHierarchyChoicesModal, setShowHierarchyChoices] = useState(false)

  const showHierarchyButton = isEditing && !showHierarchyChoicesModal && !hasStagedDelete && !isReadOnly

  const hasPending = hasPendingHierarchy(pending, concept.name)

  const conceptColor =
    treeItem?.pendingAction === ACTION.ADD
      ? theme.concept.color.add
      : treeItem?.pendingAction === ACTION.DELETE
        ? theme.concept.color.remove
        : hasStagedHierarchy || hasPending.any
          ? theme.concept.color.edit
          : theme.palette.primary.main

  return (
    <Stack direction='row' sx={{ alignItems: 'center', position: 'relative' }}>
      <Typography
        component='div'
        sx={{
          backgroundColor: 'transparent',
          color: conceptColor,
          fontFamily: theme.concept.fontFamily,
          fontSize: theme.concept.infoFontSize,
          fontWeight: theme.concept.fontWeight,
        }}
        variant='body1'
      >
        <DsgLink concept={concept} />
      </Typography>
      {showHierarchyButton && <ConceptHierarchyIcon onClick={() => setShowHierarchyChoices(true)} />}
      {showHierarchyChoicesModal && <ConceptHierarchyChoices closeChoices={() => setShowHierarchyChoices(false)} />}
    </Stack>
  )
}

export default ConceptName
