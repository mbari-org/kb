import { use, useMemo } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import Action from './Action'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { PENDING } from '@/lib/constants'

const { ACCEPT, REJECT } = PENDING.APPROVAL

const ActionsText = ({ color = 'cancel', text }) => (
  <Typography color={color} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
    {text}
  </Typography>
)

const DiscardingText = () => (
  <>
    <ActionsText text='Discarding edits is final.' />
    <ActionsText text='Please confirm you want to discard the indicated edits.' />
  </>
)

const PendingText = ({ approval }) => {
  const [color, line1, line2] = useMemo(() => {
    if (approval === ACCEPT) return ['clean', 'Approving', 'approve']
    if (approval === REJECT) return ['cancel', 'Rejecting', 'reject']
  }, [approval])

  return (
    <>
      <ActionsText color={color} text={`${line1} pending edits is final.`} />
      <ActionsText
        color={color}
        text={`Please confirm you want to ${line2} the indicated pending edits.`}
      />
    </>
  )
}

const Actions = ({ colors, disabled, labels, onAction }) => {
  const { confirmPending, confirmReset } = use(ConceptContext)

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
        {!!confirmReset && <DiscardingText />}
        {!!confirmPending && <PendingText approval={confirmPending.approval} />}
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
