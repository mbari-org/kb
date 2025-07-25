import { Button } from '@mui/material'

const StructureChoiceButton = ({ color = 'primary', disabled, onClick, text }) => {
  return (
    <Button variant='contained' color={color} disabled={disabled} onClick={onClick}>
      {text}
    </Button>
  )
}

export default StructureChoiceButton
