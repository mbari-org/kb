import { Box } from '@mui/material'

import ActionButton from './ActionButton'

const Actions = ({ colors, disabled, labels, onAction }) => {
  const actionColor = index => (colors ? colors[index] : 'main')

  const actions = labels.map((label, index) => (
    <ActionButton
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
