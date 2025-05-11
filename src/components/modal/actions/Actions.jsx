import { use } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import Action from './Action'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { LABELS } from '@/lib/constants'

const { APPROVE } = LABELS.BUTTON

const WarningText = ({ text }) => (
  <Typography color='cancel' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
    {text}
  </Typography>
)

const DiscardWarning = () => (
  <>
    <WarningText text='Discarding edits is final.' />
    <WarningText text='Please confirm you want to discard the indicated edits.' />
  </>
)

const PendingWarning = ({ action }) => {
  const line1 = action === APPROVE ? 'Approving' : 'Rejecting'
  const line2 = action === APPROVE ? 'approve' : 'reject'

  return (
    <>
      <WarningText text={`${line1} pending edits is final.`} />
      <WarningText text={`Please confirm you want to ${line2} the indicated pending edits.`} />
    </>
  )
}

const Actions = ({ colors, disabled, labels, onAction }) => {
  const { confirmDiscard, confirmPending } = use(ConceptContext)

  const actionColor = index => (colors ? colors[index] : 'main')

  const actions = labels.map((label, index) => (
    <Action
      color={actionColor(index)}
      disabled={disabled && disabled[index]}
      index={index}
      key={index}
      label={label}
      onAction={onAction}
      totalActions={labels.length}
    />
  ))

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={0} sx={{ alignItems: 'center', minHeight: '60px', mt: 2 }}>
        {!!confirmDiscard && <DiscardWarning />}
        {!!confirmPending && <PendingWarning action={confirmPending.action} />}
      </Stack>
      <Box
        sx={{
          backgroundColor: 'inherit',
          display: 'flex',
          justifyContent: 'space-between',
          mt: 2,
          padding: 1,
          width: '100%',
        }}
      >
        {actions}
      </Box>
    </Box>
  )
}

export default Actions
