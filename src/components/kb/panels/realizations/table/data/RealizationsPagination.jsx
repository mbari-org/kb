import { Typography, Box, IconButton, Select, MenuItem } from '@mui/material'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

import PageControl from '@/components/common/PageControl'
import usePageCommit from '@/lib/hooks/usePageCommit'
import { PAGINATION } from '@/lib/constants/pagination.js'

const PAGE_SIZE_OPTIONS = PAGINATION.REALIZATIONS.PAGE_SIZE_OPTIONS

const RealizationsPagination = ({ currentPage, displayRealizations, onPageChange, onPageSizeChange, pageSize }) => {
  const totalCount = displayRealizations.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalCount)

  const handleNextPage = () => {
    if (validCurrentPage < totalPages) {
      onPageChange(validCurrentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (validCurrentPage > 1) {
      onPageChange(validCurrentPage - 1)
    }
  }

  const handlePageCommit = usePageCommit(validCurrentPage, totalPages, handleNextPage, handlePrevPage)

  const handlePageSizeChange = newPageSize => {
    onPageSizeChange(newPageSize)
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        px: 2,
        width: '100%',
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
        <Typography variant='body2'>Rows per page:</Typography>
        <Select
          value={pageSize}
          onChange={e => handlePageSizeChange(Number(e.target.value))}
          size='small'
          sx={{
            height: '24px',
            '& .MuiSelect-select': {
              padding: '2px 4px',
              textAlign: 'center',
              width: '32px',
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
          Realizations {totalCount > 0 ? startIndex + 1 : 0} - {endIndex} of {totalCount}
        </Typography>
      </Box>
      <Box sx={{ alignItems: 'center', display: 'flex' }}>
        <PageControl currentPage={validCurrentPage} totalPages={totalPages} handlePageCommit={handlePageCommit} />
        <Box>
          <IconButton onClick={handlePrevPage} disabled={validCurrentPage <= 1} size='small'>
            <IoIosArrowBack />
          </IconButton>
          <IconButton onClick={handleNextPage} disabled={validCurrentPage >= totalPages} size='small'>
            <IoIosArrowForward />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default RealizationsPagination
