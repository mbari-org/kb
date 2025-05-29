import { Typography, Box, TextField, IconButton, Select, MenuItem } from '@mui/material'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

import { HISTORY } from '@/lib/constants'

const PAGE_SIZE_OPTIONS = HISTORY.PAGE_SIZE_OPTIONS

const HistoryPagination = ({
  limit,
  offset,
  count,
  nextPage,
  prevPage,
  setPageSize,
  hideFooter = false,
}) => {
  const currentPage = Math.floor(offset / limit) + 1 // Convert to 1-based index
  const totalPages = Math.ceil(count / limit)

  const handlePageCommit = event => {
    const newPage = parseInt(event.target.value)
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      const pageDiff = newPage - currentPage
      if (pageDiff > 0) {
        // Move forward by pageDiff pages
        for (let i = 0; i < pageDiff; i++) {
          nextPage()
        }
      } else if (pageDiff < 0) {
        // Move backward by |pageDiff| pages
        for (let i = 0; i < -pageDiff; i++) {
          prevPage()
        }
      }
    }
    // Reset the input value to current page
    event.target.value = currentPage
  }

  const CustomPagination = () => {
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

  if (hideFooter) return null

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        px: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant='body2'>Rows per page:</Typography>
        <Select
          value={limit}
          onChange={e => setPageSize(Number(e.target.value))}
          size='small'
          sx={{
            height: '24px',
            '& .MuiSelect-select': {
              padding: '2px 4px',
              width: '32px',
              textAlign: 'center',
            },
          }}
        >
          {PAGE_SIZE_OPTIONS.map(size => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography variant='body2'>
          History {offset + 1} - {Math.min(offset + limit, count)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CustomPagination />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={prevPage} disabled={offset === 0} size='small'>
            <IoIosArrowBack />
          </IconButton>
          <IconButton onClick={nextPage} disabled={offset + limit >= count} size='small'>
            <IoIosArrowForward />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default HistoryPagination
