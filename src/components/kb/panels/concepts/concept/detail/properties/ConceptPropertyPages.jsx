import { useState, useEffect } from 'react'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'

import ConceptPropertiesDetails from './ConceptPropertiesDetails'
import ConceptPropertiesSummary from './ConceptPropertiesSummary'

import { CONCEPT_PROPERTY_LIST } from '@/lib/constants'

const { ITEMS_PER_PAGE } = CONCEPT_PROPERTY_LIST

const ConceptPropertyPages = ({
  children,
  defaultExpanded = true,
  disablePagination = false,
  fixedHeight,
  IconComponent,
  isLoading = false,
  items = [],
  loadingText = 'Loading...',
  renderComponent = null,
  renderItem,
  title,
}) => {
  const [expanded, setExpanded] = useState(fixedHeight !== undefined || defaultExpanded)
  const [page, setPage] = useState(0)
  const [animationDirection, setAnimationDirection] = useState('up')
  const rowsPerPage = ITEMS_PER_PAGE

  const hasItems = items?.length > 0
  const showEmptyIcon = !hasItems && !isLoading

  // Track previous items state to detect transitions
  const [prevHasItems, setPrevHasItems] = useState(hasItems)

  // collapsed when no items (unless fixedHeight is set)
  useEffect(() => {
    if (showEmptyIcon && fixedHeight === undefined) {
      setExpanded(false)
    }
  }, [showEmptyIcon, fixedHeight])

  // Auto-expand when items go from empty to non-empty
  useEffect(() => {
    if (!prevHasItems && hasItems && fixedHeight === undefined) {
      setExpanded(true)
    }
    setPrevHasItems(hasItems)
  }, [hasItems, prevHasItems, fixedHeight])

  const handleToggle = () => {
    // Only allow toggle if there are items and fixedHeight is not set
    if (hasItems && fixedHeight === undefined) {
      setExpanded(!expanded)
    }
  }

  // Reset page when items change
  useEffect(() => {
    setPage(0)
  }, [items])

  const handleChangePage = (newPage, direction) => {
    if (direction) {
      setAnimationDirection(direction)
    } else {
      // Fallback to calculating direction if not provided
      const calculatedDirection = newPage > page ? 'down' : 'up'
      setAnimationDirection(calculatedDirection)
    }
    setPage(newPage)
    // Ensure accordion is expanded when pagination buttons are clicked (unless fixedHeight is set)
    if (!expanded && fixedHeight === undefined) {
      setExpanded(true)
    }
  }

  return (
    <Accordion
      expanded={fixedHeight !== undefined || expanded}
      onChange={() => {}} // Disable default accordion behavior
      sx={{
        boxShadow: 'none',
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        onClick={e => {
          // Only handle accordion toggle if click is not on interactive elements
          if (!e.target.closest('.clickable-element')) {
            e.stopPropagation()
          }
        }}
        // This CSS overrides the default accordion summary
        sx={{
          '& .MuiAccordionSummary-content': {
            m: 0,
          },
          px: 0,
          cursor: 'default !important',
          '&:hover': {
            cursor: 'default !important',
          },
          minHeight: '56px !important',
          height: '56px',
          ...(fixedHeight !== undefined && {
            height: '56px',
          }),
        }}
      >
        <ConceptPropertiesSummary
          currentPage={page}
          disablePagination={disablePagination}
          expanded={expanded}
          fixedHeight={fixedHeight}
          handleToggle={handleToggle}
          hasItems={hasItems}
          IconComponent={IconComponent}
          itemsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onPageTextClick={() => {
            if (!expanded && fixedHeight === undefined) {
              setExpanded(true)
            }
          }}
          showEmptyIcon={showEmptyIcon}
          title={title}
          totalItems={items.length}
        >
          {children}
        </ConceptPropertiesSummary>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          p: 0,
          ...(fixedHeight !== undefined && {
            height: fixedHeight,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }),
        }}
      >
        <ConceptPropertiesDetails
          animationDirection={animationDirection}
          currentPage={page}
          fixedHeight={fixedHeight}
          hasItems={hasItems}
          isLoading={isLoading}
          items={items}
          itemsPerPage={rowsPerPage}
          loadingText={loadingText}
          renderComponent={renderComponent}
          renderItem={renderItem}
        />
      </AccordionDetails>
    </Accordion>
  )
}

export default ConceptPropertyPages
