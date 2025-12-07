import { Typography, Box, IconButton, Select, MenuItem } from '@mui/material'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

import PageControl from '@/components/common/PageControl'
import usePageCommit from '@/hooks/usePageCommit'

import { PAGINATION } from '@/lib/kb/constants/pagination.js'

const PAGE_SIZE_OPTIONS = PAGINATION.TEMPLATES.PAGE_SIZE_OPTIONS

const TemplatesPagination = ({
  displayTemplates,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
}) => {
  // Calculate pagination values based on displayTemplates
  const totalCount = displayTemplates.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  // Ensure currentPage is within valid range
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  // Calculate start and end indices for current page
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

  const handlePageCommit = usePageCommit(
    validCurrentPage,
    totalPages,
    handleNextPage,
    handlePrevPage
  )

  const handlePageSizeChange = newPageSize => {
    onPageSizeChange(newPageSize)
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
        <Typography variant='body2'>Rows per page:</Typography>
        <Select
          value={pageSize}
          onChange={e => handlePageSizeChange(Number(e.target.value))}
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
          Templates {totalCount > 0 ? startIndex + 1 : 0} - {endIndex} of {totalCount}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PageControl
          currentPage={validCurrentPage}
          totalPages={totalPages}
          handlePageCommit={handlePageCommit}
        />
        <Box>
          <IconButton onClick={handlePrevPage} disabled={validCurrentPage <= 1} size='small'>
            <IoIosArrowBack />
          </IconButton>
          <IconButton
            onClick={handleNextPage}
            disabled={validCurrentPage >= totalPages}
            size='small'
          >
            <IoIosArrowForward />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default TemplatesPagination
