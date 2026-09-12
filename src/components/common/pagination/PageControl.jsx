import { Box } from '@mui/material'

import PageGo from '@/components/common/pagination/PageGo'
import PageNav from '@/components/common/pagination/PageNav'

const PageControl = ({ currentPage, handlePageGo, onNext, onPrev, totalPages }) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <PageGo currentPage={currentPage} totalPages={totalPages} handlePageGo={handlePageGo} />
    <PageNav currentPage={currentPage} totalPages={totalPages} onNext={onNext} onPrev={onPrev} />
  </Box>
)

export default PageControl
