import { use, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptStructureIcon from '@/components/icon/ConceptStructureIcon'
import ChangeStructureChoices from '@/components/kb/panels/concepts/concept/change/staged/structure/ConceptStructureChoices'
import DsgLink from '@/components/kb/panels/concepts/concept/detail/dsgLink/DsgLink'

import useStructureChoices from '@/components/kb/panels/concepts/concept/change/staged/structure/useStructureChoices'
import useConceptItem from '@/components/kb/panels/concepts/sidebar/tree/lib/useConceptItem'

import UserContext from '@/contexts/user/UserContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { hasPendingStructure } from '@/lib/model/history'
import { ACTION } from '@/lib/constants'

const ConceptName = () => {
  const theme = useTheme()

  const { isReadOnly } = use(UserContext)
  const { concept, isEditing, pending } = use(ConceptContext)
  const treeItem = useConceptItem(concept.name)

  const { hasPendingAdd, hasStagedChildren, hasStagedDelete, hasStagedName, hasStagedParent } = useStructureChoices()
  const hasStagedStructure = hasStagedChildren || hasStagedDelete || hasStagedName || hasStagedParent

  const [showStructureChoicesModal, setShowStructureChoices] = useState(false)

  const showStructureButton = isEditing && !showStructureChoicesModal && !hasStagedDelete && !isReadOnly && !hasPendingAdd

  const hasPending = hasPendingStructure(pending, concept.name)

  const conceptColor =
    treeItem?.pendingAction === ACTION.ADD
      ? theme.concept.color.add
      : treeItem?.pendingAction === ACTION.DELETE
        ? theme.concept.color.remove
        : hasStagedStructure || hasPending.any
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
      {showStructureButton && <ConceptStructureIcon onClick={() => setShowStructureChoices(true)} />}
      {showStructureChoicesModal && <ChangeStructureChoices closeChoices={() => setShowStructureChoices(false)} />}
    </Stack>
  )
}

export default ConceptName
