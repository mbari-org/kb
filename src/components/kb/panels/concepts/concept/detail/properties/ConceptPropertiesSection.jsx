import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Stack,
} from '@mui/material'

import { IoChevronDown } from 'react-icons/io5'

import ConceptPropertiesEmpty from './ConceptPropertiesEmpty'
import ConceptPropertiesPageControls from './ConceptPropertiesPageControls'

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

  const handleChangePage = (_event, newPage) => {
    setPage(newPage)
    // Ensure accordion is expanded when pagination buttons are clicked
    if (!expanded) {
      setExpanded(true)
    }
  }

  const startIndex = page * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          {IconComponent && (
            <Box
              className='clickable-element'
              sx={{
                alignItems: 'center',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                ml: -0.5,
                mt: -1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <IconComponent />
            </Box>
          )}
          <Box sx={{ ml: 2 }}>{children}</Box>
        </Box>
        {!disablePagination && hasItems && (
          <Box
            className='clickable-element'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mr: 2,
              cursor: 'default', // Ensure no pointer cursor on pagination area
            }}
            onClick={e => e.stopPropagation()} // Prevent accordion interference
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                gap: 1,
                justifyContent: 'flex-end',
                minWidth: 175,
              }}
            >
              <Typography
                className='clickable-element'
                variant='body2'
                sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }}
                onClick={() => {
                  // Ensure accordion is expanded when pagination text is clicked
                  if (!expanded) {
                    setExpanded(true)
                  }
                }}
              >
                {`${startIndex + 1}-${Math.min(endIndex, items.length)} of ${items.length}`}
              </Typography>
              <ConceptPropertiesPageControls
                currentPage={page}
                totalPages={Math.ceil(items.length / rowsPerPage)}
                onPrevious={() => handleChangePage(null, page - 1)}
                onNext={() => handleChangePage(null, page + 1)}
              />
            </Box>
          </Box>
        )}
        {showEmptyIcon && (
          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            <ConceptPropertiesEmpty />
          </Box>
        )}
        {!showEmptyIcon && (
          <Box
            className='clickable-element'
            onClick={handleToggle}
            sx={{
              alignItems: 'center',
              borderRadius: '50%',
              cursor: 'pointer !important',
              display: 'flex',
              height: 32,
              justifyContent: 'center',
              mr: -0.5,
              width: 32,
              '&:hover': {
                backgroundColor: 'action.hover',
                cursor: 'pointer !important',
              },
              '& *': {
                cursor: 'pointer !important', // Ensure child elements also have pointer cursor
              },
            }}
          >
            <IoChevronDown
              size={24}
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </Box>
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0, pb: 1, px: 0, mt: -2 }}>
        {isLoading && (
          <Typography variant='body2' sx={{ color: 'text.secondary', py: 1 }}>
            {loadingText}
          </Typography>
        )}
        {hasItems && !isLoading && (
          <Box sx={{ ml: 1.5, mt: 1 }}>
            <Stack spacing={1}>
              {paginatedItems.map((item, index) => (
                <Box key={renderItem.key ? renderItem.key(item, index) : index}>
                  {renderComponent
                    ? renderComponent(item, index)
                    : typeof renderItem.content === 'function'
                    ? renderItem.content(item, index)
                    : renderItem.content}
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default ConceptPropertiesSection
