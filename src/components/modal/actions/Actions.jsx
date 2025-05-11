import { use } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import Action from './Action'

import ConceptContext from '@/contexts/concept/ConceptContext'

const Actions = ({ colors, disabled, labels, onAction }) => {
  const { confirmDiscard } = use(ConceptContext)

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
        {!!confirmDiscard && (
          <>
            <Typography color='cancel' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Discarding edits is final.
            </Typography>
            <Typography color='cancel' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Please confirm you want to discard the indicated edits.
            </Typography>
          </>
        )}
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
