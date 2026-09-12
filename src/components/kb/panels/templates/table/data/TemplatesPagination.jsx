import Pagination from '@/components/common/Pagination'

import { PAGINATION } from '@/lib/constants/pagination.js'

const PAGE_SIZE_OPTIONS = PAGINATION.TEMPLATES.PAGE_SIZE_OPTIONS

const TemplatesPagination = ({ templates, pageSize, currentPage, onPageChange, onPageSizeChange }) => {
  const totalCount = templates.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (validCurrentPage - 1) * pageSize

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

  return (
    <Pagination
      count={totalCount}
      limit={pageSize}
      offset={startIndex}
      onGoTo={onPageChange}
      onNext={handleNextPage}
      onPageSizeChange={onPageSizeChange}
      onPrev={handlePrevPage}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
    />
  )
}

export default TemplatesPagination
