import { Box, MenuItem, Select, Typography } from '@mui/material'

const PageSize = ({ onPageSizeChange, pageSize, pageSizeOptions }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography variant='body2'>Rows per page:</Typography>
    <Select
      onChange={e => onPageSizeChange(Number(e.target.value))}
      size='small'
      sx={{
        height: '24px',
        '& .MuiSelect-select': {
          padding: '2px 4px',
          width: '32px',
          textAlign: 'center',
        },
      }}
      value={pageSize}
    >
      {pageSizeOptions.map(size => (
        <MenuItem key={size} value={size}>
          {size}
        </MenuItem>
      ))}
    </Select>
  </Box>
)

export default PageSize
