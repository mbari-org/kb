import { useCallback } from 'react'

/**
 * Custom hook for handling page commit in pagination components
 * @param {number} currentPage - Current page number (1-based)
 * @param {number} totalPages - Total number of pages
 * @param {function} nextPage - Move to next page
 * @param {function} prevPage - Move to previous page
 * @returns {function} handlePageCommit - Page commit handler
 */
const usePageCommit = (currentPage, totalPages, nextPage, prevPage) => {
  const handlePageCommit = useCallback(
    event => {
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
    },
    [currentPage, totalPages, nextPage, prevPage]
  )

  return handlePageCommit
}

export default usePageCommit
