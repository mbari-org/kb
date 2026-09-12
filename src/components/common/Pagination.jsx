import { Box } from '@mui/material'

import PageControl from '@/components/common/pagination/PageControl'
import PageRows from '@/components/common/pagination/PageRows'
import PageSize from '@/components/common/pagination/PageSize'
import usePageGo from '@/lib/hooks/usePageGo'

const Pagination = ({ count, limit, offset, onGoTo, onNext, onPageSizeChange, onPrev, pageSizeOptions }) => {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(count / limit)
  const handlePageGo = usePageGo(currentPage, totalPages, onGoTo)

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        minHeight: '30px',
        px: 2,
        width: '100%',
      }}
    >
      {count > 0 && (
        <>
          <PageSize onPageSizeChange={onPageSizeChange} pageSize={limit} pageSizeOptions={pageSizeOptions} />
          <PageRows count={count} limit={limit} offset={offset} />
          <PageControl
            currentPage={currentPage}
            handlePageGo={handlePageGo}
            onNext={onNext}
            onPrev={onPrev}
            totalPages={totalPages}
          />
        </>
      )}
    </Box>
  )
}

export default Pagination
