import { useState, useEffect } from 'react'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'

import ConceptPropertiesDetails from './ConceptPropertiesDetails'
import ConceptPropertiesSummary from './ConceptPropertiesSummary'

import { CONCEPT_PROPERTIES } from '@/lib/constants'

const { ITEMS_PER_PAGE } = CONCEPT_PROPERTIES

const ConceptPropertiesSection = ({
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

  const handleChangePage = newPage => {
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
        sx={{
          '& .MuiAccordionSummary-content': {
            m: 0,
          },
          px: 0,
          cursor: 'default !important', // Override Material-UI's default pointer cursor
          '&:hover': {
            cursor: 'default !important', // Ensure hover doesn't change cursor
          },
          ...(fixedHeight !== undefined && {
            minHeight: 'auto', // Prevent height changes when content changes
          }),
        }}
      >
        <ConceptPropertiesSummary
          fixedHeight={fixedHeight}
          expanded={expanded}
          handleToggle={handleToggle}
          IconComponent={IconComponent}
          showEmptyIcon={showEmptyIcon}
          title={title}
          currentPage={page}
          disablePagination={disablePagination}
          hasItems={hasItems}
          itemsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onPageTextClick={() => {
            if (!expanded && fixedHeight === undefined) {
              setExpanded(true)
            }
          }}
          totalItems={items.length}
        >
          {children}
        </ConceptPropertiesSummary>
      </AccordionSummary>
      <AccordionDetails 
        sx={{ 
          pt: 0, 
          pb: 1, 
          px: 0, 
          mt: -2,
          ...(fixedHeight !== undefined && {
            height: fixedHeight,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          })
        }}
      >
        <ConceptPropertiesDetails
          fixedHeight={fixedHeight}
          isLoading={isLoading}
          loadingText={loadingText}
          hasItems={hasItems}
          items={items}
          currentPage={page}
          itemsPerPage={rowsPerPage}
          renderComponent={renderComponent}
          renderItem={renderItem}
        />
      </AccordionDetails>
    </Accordion>
  )
}

export default ConceptPropertiesSection
