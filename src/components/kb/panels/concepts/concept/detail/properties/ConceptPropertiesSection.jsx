import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Stack,
  Typography,
} from '@mui/material'

import ConceptPropertiesDetails from './ConceptPropertiesDetails'
import ConceptPropertiesSummary from './ConceptPropertiesSummary'

import { CONCEPT_PROPERTIES } from '@/lib/constants'

const { ITEMS_PER_PAGE } = CONCEPT_PROPERTIES

const ConceptPropertiesSection = ({
  children,
  defaultExpanded = true,
  disablePagination = false,
  IconComponent,
  isLoading = false,
  items = [],
  loadingText = 'Loading...',
  renderComponent = null,
  renderItem,
  title,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [page, setPage] = useState(0)
  const rowsPerPage = ITEMS_PER_PAGE

  const hasItems = items?.length > 0
  const showEmptyIcon = !hasItems && !isLoading

  // collapsed when no items
  useEffect(() => {
    if (showEmptyIcon) {
      setExpanded(false)
    }
  }, [showEmptyIcon])

  const handleToggle = () => {
    // Only allow toggle if there are items
    if (hasItems) {
      setExpanded(!expanded)
    }
  }

  // Reset page when items change
  useEffect(() => {
    setPage(0)
  }, [items])

  const handleChangePage = newPage => {
    setPage(newPage)
    // Ensure accordion is expanded when pagination buttons are clicked
    if (!expanded) {
      setExpanded(true)
    }
  }

  return (
    <Accordion
      expanded={expanded}
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
        }}
      >
        <ConceptPropertiesSummary
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
            if (!expanded) {
              setExpanded(true)
            }
          }}
          totalItems={items.length}
        >
          {children}
        </ConceptPropertiesSummary>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0, pb: 1, px: 0, mt: -2 }}>
        <ConceptPropertiesDetails
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
