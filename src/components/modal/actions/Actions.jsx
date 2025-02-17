import { use } from 'react'

import { Box, Typography } from '@mui/material'

import Action from './Action'

import ModalContext from '@/contexts/modal/ModalContext'

const Actions = ({ colors, disabled, labels, onAction }) => {
  const { data } = use(ModalContext)

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
      <Box sx={{ minHeight: '44px', display: 'flex', justifyContent: 'center' }}>
        {data?.confirmResetFn && (
          <Typography color='error' sx={{ mt: 2 }}>
            Discarding edits is final. Please confirm to discard.
          </Typography>
        )}
      </Box>
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
