import { use } from 'react'

import { ToggleButtonGroup } from '@mui/material'
import HistoryToggleButton from './HistoryToggleButton'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import { SELECTED } from '@/constants/selected.js'

const { PENDING, APPROVED, CONCEPT } = SELECTED.SETTINGS.HISTORY.TYPES

const HistoryHeaderToggle = ({ onChange }) => {
  const { selectedType } = use(HistoryContext)

  return (
    <ToggleButtonGroup
      aria-label='history type'
      exclusive
      onChange={onChange}
      size='small'
      sx={{ mr: 1 }}
      value={selectedType}
    >
      <HistoryToggleButton value={APPROVED} />
      <HistoryToggleButton value={PENDING} />
      <HistoryToggleButton value={CONCEPT} />
    </ToggleButtonGroup>
  )
}

export default HistoryHeaderToggle
