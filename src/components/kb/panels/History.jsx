import { useState } from 'react'
import { Typography, ToggleButtonGroup, Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import HistoryToggleButton from '@/components/kb/panels/history/HistoryToggleButton'
import useHistoryColumns from '@/components/kb/panels/history/useHistoryColumns'
import useHistoryCount from '@/components/kb/panels/history/useHistoryCount'

import useLoadHistory from '@/components/kb/panels/history/useLoadHistory'

const History = () => {
  const [type, setType] = useState('pending')

  const pendingHistory = useLoadHistory('pending')
  const approvedHistory = useLoadHistory('approved')
  const history = type === 'pending' ? pendingHistory : approvedHistory

  const columns = useHistoryColumns({ type })
  const count = useHistoryCount(type)

  const handleTypeChange = (_, newType) => !!newType && setType(newType)

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography align='center' sx={{ mt: 3, mb: 1 }} variant='h3'>
        History
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: -2 }}>
        <Typography sx={{ ml: 2, mt: -2 }}>Total: {count}</Typography>
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={handleTypeChange}
          aria-label='history type'
          size='small'
          sx={{ mr: 2, mt: -2 }}
        >
          <HistoryToggleButton value='pending' />
          <HistoryToggleButton value='approved' />
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <DataGrid
          rows={history.history}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          sx={{
            height: '100%',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'background.paper',
              '& .MuiDataGrid-columnHeader': {
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 700,
                  fontSize: '1rem',
                },
              },
            },
          }}
        />
      </Box>
    </Box>
  )
}

export default History
