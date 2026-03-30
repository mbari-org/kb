import { useCallback, useState } from 'react'

import { Button } from '@mui/material'

const ActionButton = ({ color, disabled, index, label, onAction, totalActions }) => {
  const [asyncError, setAsyncError] = useState(null)
  const isMiddleButton = totalActions === 3 && index === 1
  const isLastButton = totalActions === 3 && index === 2
  const isSecondButton = totalActions === 2 && index === 1
  if (asyncError) {
    throw asyncError
  }

  const handleClick = useCallback(() => {
    try {
      const actionResult = onAction(label)
      if (actionResult && typeof actionResult.then === 'function') {
        actionResult.catch(setAsyncError)
      }
    } catch (error) {
      setAsyncError(error)
    }
  }, [label, onAction])
  return (
    <Button
      key={index}
      color={color || 'main'}
      disabled={disabled}
      onClick={handleClick}
      sx={{
        justifySelf: isMiddleButton ? 'center' : isLastButton || isSecondButton ? 'end' : 'start',
        marginLeft: totalActions === 1 ? 'auto' : 'inherit',
        minWidth: 'auto',
        paddingX: 2,
        textAlign: index > 0 && index < totalActions - 1 ? 'center' : 'inherit',
        whiteSpace: 'nowrap',
      }}
      variant='contained'
    >
      {label}
    </Button>
  )
}

export default ActionButton
