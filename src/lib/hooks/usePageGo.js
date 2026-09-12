import { useCallback } from 'react'

const usePageGo = (currentPage, totalPages, goToPage) => {
  const handlePageGo = useCallback(
    event => {
      const enteredPage = parseInt(event.target.value, 10)
      if (!isNaN(enteredPage)) {
        goToPage(Math.min(totalPages, Math.max(1, enteredPage)))
      }
      // Reset the input value to current page
      event.target.value = currentPage
    },
    [currentPage, totalPages, goToPage]
  )

  return handlePageGo
}

export default usePageGo
