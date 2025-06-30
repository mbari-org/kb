import { use } from 'react'

import { Box, Stack } from '@mui/material'

import Action from './Action'
import DiscardingText from './DiscardingText'
import PendingText from './PendingText'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

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
      <Stack spacing={0} sx={{ alignItems: 'center', mt: 1 }}>
        {!!confirmReset && <DiscardingText />}
        {!!confirmPending && <PendingText approval={confirmPending.approval} />}
      </Stack>
      <Box
        sx={{
          backgroundColor: 'inherit',
          display: 'flex',
          justifyContent: 'space-between',
          mt: 1,
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
