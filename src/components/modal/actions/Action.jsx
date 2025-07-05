import { Button } from '@mui/material'

const Action = ({ color, disabled, index, label, onAction, totalActions }) => {
  const isMiddleButton = totalActions === 3 && index === 1
  const isLastButton = totalActions === 3 && index === 2
  const isSecondButton = totalActions === 2 && index === 1

  return (
    <Button
      key={index}
      color={color || 'main'}
      disabled={disabled}
      onClick={() => onAction(label)}
      sx={{
        marginLeft: totalActions === 1 ? 'auto' : 'inherit',
        minWidth: 'auto',
        paddingX: 2,
        textAlign: index > 0 && index < totalActions - 1 ? 'center' : 'inherit',
        whiteSpace: 'nowrap',
        justifySelf: isMiddleButton ? 'center' : isLastButton || isSecondButton ? 'end' : 'start',
      }}
      variant='contained'
    >
      {label}
    </Button>
  )
}

export default Action
