import { Box, IconButton } from '@mui/material'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

const PageNav = ({ currentPage, onNext, onPrev, totalPages }) => (
  <Box>
    <IconButton disabled={currentPage <= 1} onClick={onPrev} size='small'>
      <IoIosArrowBack />
    </IconButton>
    <IconButton disabled={currentPage >= totalPages} onClick={onNext} size='small'>
      <IoIosArrowForward />
    </IconButton>
  </Box>
)

export default PageNav
