import { use, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ChangeStructureButton from '@/components/kb/panels/concepts/change/staged/concept/structure/ConceptStructureButton'
import ChangeStructureChoices from '@/components/kb/panels/concepts/change/staged/concept/structure/ConceptStructureChoices'

import useStructureChoices from '@/components/kb/panels/concepts/change/staged/concept/structure/useStructureChoices'

import AuthContext from '@/contexts/auth/AuthContext'
import ConceptContext from '@/contexts/concept/ConceptContext'

import useConceptPending from '@/contexts/concept/pending/useConceptPending'

import { isReadOnly } from '@/lib/auth/role'
import { hasPending, pendingChild } from '@/lib/kb/model/history'

const ConceptName = () => {
  const theme = useTheme()

  const { user } = use(AuthContext)
  const { concept, editing } = use(ConceptContext)

  const conceptPending = useConceptPending(concept.name)
  const parentPending = useConceptPending(concept?.parent)

  const { hasStagedChildren, hasStagedName, hasStagedParent } = useStructureChoices()
  const hasStagedStructure = hasStagedChildren || hasStagedName || hasStagedParent

  const [showStructureChoicesModal, setShowStructureChoices] = useState(false)

  const showStructureButton =
    editing && !showStructureChoicesModal && !hasStagedName && !isReadOnly(user)

  const hasPendingStructure =
    ['ConceptName', 'Parent', 'Concept.child', 'Concept.parent'].some(field =>
      hasPending(conceptPending, field)
    ) || !!pendingChild(parentPending, concept.name)

  const conceptColor =
    hasStagedStructure || hasPendingStructure
      ? theme.concept.color.edit
      : theme.palette.primary.main

  return (
    <Stack direction='row' alignItems='center' sx={{ position: 'relative' }}>
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
        {concept?.name}
      </Typography>
      {showStructureButton && (
        <ChangeStructureButton onClick={() => setShowStructureChoices(true)} />
      )}
      {showStructureChoicesModal && (
        <ChangeStructureChoices closeChoices={() => setShowStructureChoices(false)} />
      )}
    </Stack>
  )
}

export default ConceptName
