import { Box, TextField, Typography } from '@mui/material'

const PageControl = ({ currentPage, totalPages, handlePageCommit }) => {
  // Ensure currentPage is a valid number and convert to string
  const defaultValue = String(Math.max(1, currentPage || 1))

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
      <Typography variant='body2'>Page</Typography>
      <TextField
        key={currentPage}
        defaultValue={defaultValue}
        onBlur={handlePageCommit}
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
      <Typography variant='body2'>of {totalPages}</Typography>
    </Box>
  )
}

export default PageControl
