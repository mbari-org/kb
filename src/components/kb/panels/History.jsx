import { useState } from 'react'
import { Typography, ToggleButtonGroup, Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import HistoryToggleButton from '@/components/kb/panels/history/HistoryToggleButton'
import useHistoryColumns from '@/components/kb/panels/history/useHistoryColumns'

import useLoadHistory from '@/components/kb/panels/history/useLoadHistory'

const History = () => {
  const [type, setType] = useState('pending')
  const pendingHistory = useLoadHistory('pending')
  const approvedHistory = useLoadHistory('approved')
  const history = type === 'pending' ? pendingHistory : approvedHistory
  const columns = useHistoryColumns({ type })

  const handleTypeChange = (_, newType) => !!newType && setType(newType)

  return (
    <Box>
      <Typography align='center' sx={{ mt: 3, mb: 1 }} variant='h3'>
        History
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mt: -2 }}>
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
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={history.history}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          sx={{
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
      </div>
    </Box>
  )
}

export default History
