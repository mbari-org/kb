import { Typography, Box, TextField, IconButton } from '@mui/material'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]

const UsersPagination = ({ limit, offset, count, nextPage, prevPage, setPageSize }) => {
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
        <Typography>Page</Typography>
        <TextField
          size='small'
          defaultValue={currentPage}
          onBlur={handlePageCommit}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              e.target.blur()
            }
          }}
          inputProps={{
            style: { textAlign: 'center', width: '60px' },
          }}
        />
        <Typography>of {totalPages}</Typography>
      </Box>
    )
  }

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
        <Typography>Rows per page:</Typography>
        <select
          value={limit}
          onChange={e => setPageSize(Number(e.target.value))}
          style={{ margin: '0 8px' }}
        >
          {PAGE_SIZE_OPTIONS.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography>
          Users {offset + 1} - {Math.min(offset + limit, count)} of {count}
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

export default UsersPagination
