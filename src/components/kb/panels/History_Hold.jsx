import { use } from 'react'
import { Box } from '@mui/material'

import ConceptHistory from '@/components/kb/panels/history/ConceptHistory'
import HistoryHeaderToggle from '@/components/kb/panels/history/header/HistoryHeaderToggle'
import TypeHistory from '@/components/kb/panels/history/TypeHistory'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const History = () => {
  const { getSelected, select } = use(SelectedContext)

  const selectedHistoryType = getSelected('history').type

  const isTypeHistory =
    selectedHistoryType === SELECTED.HISTORY.TYPE.PENDING ||
    selectedHistoryType === SELECTED.HISTORY.TYPE.APPROVED

  const handleHistorySelection = (_, newSelection) =>
    !!newSelection && select({ history: newSelection })

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <HistoryHeaderToggle selected={selectedHistoryType} onChange={handleHistorySelection} />
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        {isTypeHistory ? <TypeHistory type={selectedHistoryType} /> : <ConceptHistory />}
      </Box>
    </Box>
  )
}

export default History
