import { use, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ChangeStructureButton from '@/components/kb/panels/concepts/concept/change/staged/concept/structure/ConceptStructureButton'
import ChangeStructureChoices from '@/components/kb/panels/concepts/concept/change/staged/concept/structure/ConceptStructureChoices'

import useStructureChoices from '@/components/kb/panels/concepts/concept/change/staged/concept/structure/useStructureChoices'

import UserContext from '@/contexts/user/UserContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import useHasPendingStructure from '@/contexts/panels/concepts/pending/useHasPendingStructure'

import { isReadOnly } from '@/lib/auth/role'

const ConceptName = () => {
  const theme = useTheme()

  const { user } = use(UserContext)
  const { concept, editing } = use(ConceptContext)

  const { hasStagedChildren, hasStagedName, hasStagedParent } = useStructureChoices()
  const hasStagedStructure = hasStagedChildren || hasStagedName || hasStagedParent

  const [showStructureChoicesModal, setShowStructureChoices] = useState(false)

  const showStructureButton =
    editing && !showStructureChoicesModal && !hasStagedName && !isReadOnly(user)

  const hasPendingStructure = useHasPendingStructure()

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
