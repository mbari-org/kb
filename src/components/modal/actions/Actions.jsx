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

  // Determine grid layout based on number of actions
  const getGridLayout = () => {
    switch (labels.length) {
      case 1:
        return {
          gridTemplateColumns: '1fr',
          justifyContent: 'center',
        }
      case 2:
        return {
          gridTemplateColumns: '1fr 1fr 1fr',
          '& > *:nth-of-type(2)': {
            gridColumn: '3',
          },
        }
      case 3:
        return {
          gridTemplateColumns: '1fr 1fr 1fr',
        }
      default:
        return {
          gridTemplateColumns: '1fr 1fr 1fr',
        }
    }
  }

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Stack spacing={0} sx={{ alignItems: 'center', mt: 1, height: 60, justifyContent: 'center' }}>
        {!!confirmReset && <DiscardingText />}
        {!!confirmPending && <PendingText confirmPending={confirmPending} />}
      </Stack>
      <Box
        sx={{
          backgroundColor: 'inherit',
          display: 'grid',
          alignItems: 'center',
          mt: 1,
          padding: 1,
          width: '100%',
          ...getGridLayout(),
        }}
      >
        {actions}
      </Box>
    </Box>
  )
}

export default Actions
