import { useCallback } from 'react'

/**
 * Custom hook for handling page commit in pagination components
 * @param {number} currentPage - Current page number (1-based)
 * @param {number} totalPages - Total number of pages
 * @param {function} nextPage - Move to next page
 * @param {function} prevPage - Move to previous page
 * @param {function} [goToPage] - Optional: jump directly to page (1-based). When provided, used instead of nextPage/prevPage loop.
 * @returns {function} handlePageCommit - Page commit handler
 */
const usePageCommit = (currentPage, totalPages, nextPage, prevPage, goToPage) => {
  const handlePageCommit = useCallback(
    event => {
      const newPage = parseInt(event.target.value)
      if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
        if (goToPage) {
          goToPage(newPage)
        } else {
          const pageDiff = newPage - currentPage
          if (pageDiff > 0) {
            for (let i = 0; i < pageDiff; i++) {
              nextPage()
            }
          } else if (pageDiff < 0) {
            for (let i = 0; i < -pageDiff; i++) {
              prevPage()
            }
          }
        }
      }
      // Reset the input value to current page
      event.target.value = currentPage
    },
    [currentPage, totalPages, nextPage, prevPage, goToPage]
  )

  return handlePageCommit
}

export default usePageCommit
