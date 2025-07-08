import { useState, useEffect } from 'react'

/**
 * Custom hook for managing pagination transitions with slide-out/fade-in effects
 * @param {number} currentPage - The current page number
 * @param {number} itemsPerPage - Number of items per page
 * @param {Array} items - Array of all items to paginate
 * @returns {Object} - Transition state and computed values
 */
export const usePaginationTransition = (currentPage, itemsPerPage, items) => {
  const [slideDirection, setSlideDirection] = useState('up')
  const [prevPage, setPrevPage] = useState(currentPage)
  const [slideIn, setSlideIn] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Use prevPage during slide-out to show old items, currentPage during slide-in for new items
  const pageToShow = !slideIn && isTransitioning ? prevPage : currentPage
  const startIndex = pageToShow * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)

  // Handle page transitions
  useEffect(() => {
    if (currentPage !== prevPage) {
      // Determine slide direction based on page change
      const direction = currentPage > prevPage ? 'up' : 'down'
      setSlideDirection(direction)

      // Stage 1: Slide out current content
      setSlideIn(false)
      setIsTransitioning(true)

      // Stage 2: After slide-out, update page and prepare new content
      const timeout = setTimeout(() => {
        setPrevPage(currentPage)
        setSlideIn(true)
        // Keep isTransitioning=true so new content starts from correct position

        // Stage 3: After new content is positioned, finish transition
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50) // Brief delay for new content to appear in starting position
      }, 300) // Wait for slide-out to complete

      return () => clearTimeout(timeout)
    }
  }, [currentPage, prevPage])

  // Computed pagination info
  const hasMoreItems = items && items.length > endIndex
  const hasPreviousItems = currentPage > 0

  // Transition styles
  const getTransitionStyles = () => ({
    // First transition slides out, second transition just fades in
    transform: slideIn
      ? 'translateY(0)' // New content: just fade in at normal position
      : slideDirection === 'up'
      ? 'translateY(-30px)'
      : 'translateY(30px)', // Old content slides out
    opacity: slideIn ? 1 : 0,
    transition: slideIn
      ? 'opacity 300ms ease-out' // New content: fade in only
      : 'transform 300ms ease-in, opacity 200ms ease-in', // Old content: slide out
  })

  return {
    getTransitionStyles,
    hasMoreItems,
    hasPreviousItems,
    isTransitioning,
    paginatedItems,
    slideDirection,
    slideIn,
  }
}
