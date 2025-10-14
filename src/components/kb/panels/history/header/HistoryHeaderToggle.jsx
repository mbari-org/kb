import { use } from 'react'

import { ToggleButtonGroup } from '@mui/material'
import HistoryToggleButton from './HistoryToggleButton'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import { SELECTED } from '@/lib/constants'

const { PENDING, APPROVED, CONCEPT } = SELECTED.SETTINGS.HISTORY.TYPES

const HistoryHeaderToggle = ({ onChange }) => {
  const { selectedType } = use(HistoryContext)

  return (
    <ToggleButtonGroup
      value={selectedType}
      exclusive
      onChange={onChange}
      aria-label='history type'
      size='small'
      sx={{ mr: 1 }}
    >
      <HistoryToggleButton value={APPROVED} />
      <HistoryToggleButton value={PENDING} />
      <HistoryToggleButton value={CONCEPT} />
    </ToggleButtonGroup>
  )
}

export default HistoryHeaderToggle
