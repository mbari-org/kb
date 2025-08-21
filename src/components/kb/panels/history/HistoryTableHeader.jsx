import { Typography, Box } from '@mui/material'

import HistoryTableHeaderTypeRight from './table/header/HistoryTableHeaderTypeRight'

const HistoryTableHeader = ({
  count,
  handleSortChange,
  sortOrder = 'desc',
  title,
  titleTopMargin = 0,
}) => {
  return (
    <Box>
      <Typography component='div' align='center' sx={{ mt: titleTopMargin, mb: 1 }} variant='h4'>
        {title}
      </Typography>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography sx={{ ml: 2 }}>Total: {count}</Typography>
        <HistoryTableHeaderTypeRight handleSortChange={handleSortChange} sortOrder={sortOrder} />
      </Box>
    </Box>
  )
}

export default HistoryTableHeader
