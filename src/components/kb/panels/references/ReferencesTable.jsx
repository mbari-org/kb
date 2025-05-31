import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const ReferencesTable = () => {
  return (
    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
      <DataGrid rows={[]} columns={[]} />
    </Box>
  )
}

export default ReferencesTable
