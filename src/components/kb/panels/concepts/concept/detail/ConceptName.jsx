import { use, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ConceptStructureIcon from '@/components/icon/ConceptStructureIcon'
import ChangeStructureChoices from '@/components/kb/panels/concepts/concept/change/staged/structure/ConceptStructureChoices'

import useStructureChoices from '@/components/kb/panels/concepts/concept/change/staged/structure/useStructureChoices'

import UserContext from '@/contexts/user/UserContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { isReadOnly } from '@/lib/auth/role'

import { hasPendingStructure } from '@/lib/kb/model/history'

const ConceptName = () => {
  const theme = useTheme()

  const { user } = use(UserContext)
  const { concept, editing, pending } = use(ConceptContext)

  const { hasStagedChildren, hasStagedDelete, hasStagedName, hasStagedParent } =
    useStructureChoices()
  const hasStagedStructure =
    hasStagedChildren || hasStagedDelete || hasStagedName || hasStagedParent

  const [showStructureChoicesModal, setShowStructureChoices] = useState(false)

  const showStructureButton =
    editing && !showStructureChoicesModal && !hasStagedDelete && !isReadOnly(user)

  const hasPending = hasPendingStructure(pending, concept.name)

  const conceptColor =
    hasStagedStructure || hasPending.any ? theme.concept.color.edit : theme.palette.primary.main

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
        <ConceptStructureIcon onClick={() => setShowStructureChoices(true)} />
      )}
      {showStructureChoicesModal && (
        <ChangeStructureChoices closeChoices={() => setShowStructureChoices(false)} />
      )}
    </Stack>
  )
}

export default ConceptName
