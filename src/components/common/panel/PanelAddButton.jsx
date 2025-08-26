import { Button } from '@mui/material'

const PanelAddButton = ({ onClick, disabled = false }) => {
  return (
    <Button variant='contained' color='primary' onClick={onClick} disabled={disabled}>
      Add
    </Button>
  )
}

export default PanelAddButton
