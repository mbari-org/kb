import { Button } from '@mui/material'

const PanelAddButton = ({ onClick }) => {
  return (
    <Button variant='contained' color='primary' onClick={onClick}>
      Add
    </Button>
  )
}

export default PanelAddButton
