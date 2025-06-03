import { ToggleButtonGroup } from '@mui/material'
import HistoryToggleButton from './HistoryToggleButton'

const HistoryTableToggle = ({ selected, onChange }) => {
  return (
    <ToggleButtonGroup
      value={selected}
      exclusive
      onChange={onChange}
      aria-label='history type'
      size='small'
      sx={{ mr: 2 }}
    >
      <HistoryToggleButton value='pending' />
      <HistoryToggleButton value='approved' />
      <HistoryToggleButton value='concept' />
    </ToggleButtonGroup>
  )
}

export default HistoryTableToggle
