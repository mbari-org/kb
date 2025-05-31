import { Box, TextField, Typography } from '@mui/material'

const PageControl = ({ currentPage, totalPages, handlePageCommit }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
      <Typography variant='body2'>Page</Typography>
      <TextField
        defaultValue={currentPage}
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
