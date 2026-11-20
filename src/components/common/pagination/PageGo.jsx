import { Box, TextField, Typography } from '@mui/material'

import CONFIG from '@/lib/config'

const { OF, PAGE } = CONFIG.UI.PAGINATION

const PageGo = ({ currentPage, handlePageGo, totalPages }) => {
  const defaultValue = String(Math.max(1, currentPage || 1))

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
      <Typography variant='body2'>{PAGE}</Typography>
      <TextField
        defaultValue={defaultValue}
        key={currentPage}
        onBlur={handlePageGo}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.target.blur()
          }
        }}
        size='small'
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '24px',
          },
          '& .MuiInputBase-input': {
            textAlign: 'center',
            width: '32px',
            padding: '2px 4px',
          },
        }}
      />
      <Typography variant='body2'>{OF.replace('{total}', totalPages)}</Typography>
    </Box>
  )
}

export default PageGo
