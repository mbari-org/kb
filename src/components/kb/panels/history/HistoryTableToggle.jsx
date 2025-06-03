import { ToggleButtonGroup } from '@mui/material'
import HistoryToggleButton from './HistoryToggleButton'

import { SELECTED } from '@/lib/constants'

const HISTORY_TYPES = {
  PENDING: SELECTED.HISTORY.TYPE.PENDING,
  APPROVED: SELECTED.HISTORY.TYPE.APPROVED,
  CONCEPT: SELECTED.HISTORY.TYPE.CONCEPT,
}

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
      <HistoryToggleButton value={HISTORY_TYPES.PENDING} />
      <HistoryToggleButton value={HISTORY_TYPES.APPROVED} />
      <HistoryToggleButton value={HISTORY_TYPES.CONCEPT} />
    </ToggleButtonGroup>
  )
}

export default HistoryTableToggle
