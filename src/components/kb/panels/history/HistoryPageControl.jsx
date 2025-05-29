import { Typography, Box, TextField } from '@mui/material'

const HistoryPageControl = ({ currentPage, totalPages, handlePageCommit }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
      <Typography variant='body2'>Page</Typography>
      <TextField
        size='small'
        defaultValue={currentPage}
        onBlur={handlePageCommit}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.target.blur()
          }
        }}
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

export default HistoryPageControl
