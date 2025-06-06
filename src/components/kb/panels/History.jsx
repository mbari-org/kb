import { use } from 'react'
import { Box } from '@mui/material'

import HistoryTableToggle from '@/components/kb/panels/history/HistoryTableToggle'
import TypeHistory from '@/components/kb/panels/history/TypeHistory'
import ConceptHistory from '@/components/kb/panels/history/ConceptHistory'
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mt: 2 }}>
        <HistoryTableToggle selected={selectedHistoryType} onChange={handleHistorySelection} />
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0, mt: -9 }}>
        {isTypeHistory ? <TypeHistory type={selectedHistoryType} /> : <ConceptHistory />}
      </Box>
    </Box>
  )
}

export default History
