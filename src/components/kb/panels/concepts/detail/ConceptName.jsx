import { use, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ApprovalButton from '@/components/kb/panels/concepts/detail/ApprovalButton'
import ChangeStructureButton from './structure/ConceptStructureButton'
import ChangeStructureChoices from './structure/ConceptStructureChoices'

import AuthContext from '@/contexts/auth/AuthContext'
import ConceptContext from '@/contexts/concept/ConceptContext'

import { getFieldPendingHistory } from '@/lib/kb/util/pendingHistory'
import { isAdmin, isReadOnly } from '@/lib/auth/role'

const ConceptName = () => {
  const theme = useTheme()

  const [showStructureChoices, setShowStructureChoices] = useState(false)

  const { user } = use(AuthContext)
  const { concept, editing, stagedState, pendingHistory } = use(ConceptContext)

  const namePendingHistory = getFieldPendingHistory(pendingHistory, 'ConceptName')
  const conceptHasNameUpdate = stagedState.name !== concept?.name

  const showApprovalButton =
    isAdmin(user) && editing && !!namePendingHistory && !showStructureChoices
  const showStructureButton = !isReadOnly(user) && editing && !showStructureChoices

  const conceptColor =
    !!namePendingHistory || conceptHasNameUpdate
      ? theme.palette.primary.pending
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
      {showStructureChoices && (
        <ChangeStructureChoices closeChoices={() => setShowStructureChoices(false)} />
      )}
    </Stack>
  )
}

export default ConceptName
