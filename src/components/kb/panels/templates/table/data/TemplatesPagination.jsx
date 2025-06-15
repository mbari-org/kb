import { Typography, Box, IconButton, Select, MenuItem } from '@mui/material'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

import PageControl from '@/components/common/PageControl'
import usePageCommit from '@/hooks/usePageCommit'

import { PAGINATION } from '@/lib/constants'

const PAGE_SIZE_OPTIONS = PAGINATION.TEMPLATES.PAGE_SIZE_OPTIONS

const TemplatesPagination = ({ limit, offset, count, nextPage, prevPage, setPageSize }) => {
  // Ensure we have valid numbers for pagination calculations
  const currentPage = Math.max(1, Math.floor(offset / limit) + 1) // Convert to 1-based index, minimum 1
  const totalPages = Math.max(1, Math.ceil(count / limit)) // Ensure at least 1 page

  const handlePageCommit = usePageCommit(currentPage, totalPages, nextPage, prevPage)

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
          Templates {offset + 1} - {Math.min(offset + limit, count)}
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

export default TemplatesPagination
