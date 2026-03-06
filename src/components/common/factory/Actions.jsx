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

  const getGridLayout = () => {
    if (labels.length === 1) {
      return {
        gridTemplateColumns: '1fr',
        justifyContent: 'center',
      }
    } else if (labels.length === 2) {
      return {
        gridTemplateColumns: '1fr 1fr 1fr',
        '& > *:nth-of-type(2)': {
          gridColumn: '3',
        },
      }
    } else if (labels.length === 3) {
      return {
        gridTemplateColumns: '1fr 1fr 1fr',
      }
    }

    return {
      gridTemplateColumns: '1fr 1fr 1fr',
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
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
