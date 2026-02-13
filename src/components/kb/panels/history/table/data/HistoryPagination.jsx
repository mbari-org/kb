import { Typography, Box, IconButton, Select, MenuItem } from '@mui/material'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

import PageControl from '@/components/common/PageControl'
import usePageCommit from '@/lib/hooks/usePageCommit'

import { PAGINATION } from '@/lib/constants/pagination.js'

const PAGE_SIZE_OPTIONS = PAGINATION.HISTORY.PAGE_SIZE_OPTIONS

const HistoryPagination = ({
  count,
  goToPage,
  hideFooter = false,
  limit,
  nextPage,
  offset,
  prevPage,
  setPageSize,
}) => {
  const currentPage = Math.floor(offset / limit) + 1 // Convert to 1-based index
  const totalPages = Math.ceil(count / limit)

  const handlePageCommit = usePageCommit(
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage
  )

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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PageControl
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageCommit={handlePageCommit}
        />
        <Box>
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
