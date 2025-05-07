import { use, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ApprovalButton from '@/components/kb/panels/concepts/detail/ApprovalButton'
import ChangeStructureButton from './structure/ConceptStructureButton'
import ChangeStructureChoices from './structure/ConceptStructureChoices'

import useStructureChoices from '@/components/kb/panels/concepts/detail/structure/useStructureChoices'

import AuthContext from '@/contexts/auth/AuthContext'
import ConceptContext from '@/contexts/concept/ConceptContext'

import { isAdmin, isReadOnly } from '@/lib/auth/role'

const ConceptName = () => {
  const theme = useTheme()

  const { user } = use(AuthContext)
  const { concept, editing, stagedState } = use(ConceptContext)

  const { disableChangeName, disableChangeParent } = useStructureChoices()

  const [showStructureChoicesModal, setShowStructureChoices] = useState(false)

  const conceptHasNameUpdate = stagedState.name !== concept?.name
  const conceptHasParentUpdate = stagedState.parent !== concept?.parent

  const showApprovalButton = isAdmin(user) && editing && !showStructureChoicesModal
  const showStructureButton =
    !isReadOnly(user) &&
    editing &&
    !showStructureChoicesModal &&
    (!disableChangeName || !disableChangeParent)

  const conceptColor =
    conceptHasNameUpdate || conceptHasParentUpdate
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
      {showApprovalButton && <ApprovalButton field={'conceptName'} />}
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
