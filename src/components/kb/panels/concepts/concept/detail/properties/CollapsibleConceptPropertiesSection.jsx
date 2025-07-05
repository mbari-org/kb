import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  IconButton,
} from '@mui/material'

import { IoChevronDown } from 'react-icons/io5'
import { RxEyeNone } from 'react-icons/rx'

import ConceptPropertiesSection from './ConceptPropertiesSection'
import ConceptPropertiesPageButtons from './ConceptPropertiesPageButtons'
import KBTooltip from '@/components/common/KBTooltip'

const CollapsibleConceptPropertiesSection = ({
  children,
  defaultExpanded = true,
  disablePagination = false,
  IconComponent,
  isLoading = false,
  items = [],
  loadingText = 'Loading...',
  onInspect,
  onInspectTooltip,
  renderComponent = null,
  renderItem,
  title,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [page, setPage] = useState(0)
  const rowsPerPage = 5

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
  }

  const startIndex = page * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)

  return (
    <Accordion
      expanded={expanded}
      onChange={() => {}} // Disable default accordion behavior
      sx={{
        '&:before': {
          display: 'none',
        },
        boxShadow: 'none',
      }}
    >
      <AccordionSummary
        onClick={e => e.stopPropagation()} // Prevent default toggle
        sx={{
          '& .MuiAccordionSummary-content': {
            m: 0,
          },
          px: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          {onInspect && (
            <KBTooltip title={onInspectTooltip} placement='top'>
              <Box
                onClick={e => {
                  e.stopPropagation() // Prevent accordion toggle
                  onInspect()
                }}
                sx={{
                  ml: -0.5,
                  mt: -1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 30,
                  height: 32,
                  borderRadius: '50%',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <IconComponent />
              </Box>
            </KBTooltip>
          )}
          <Box sx={{ ml: 2 }}>{children}</Box>
        </Box>
        {!disablePagination && hasItems && (
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}
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
              <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>
                {`${startIndex + 1}-${Math.min(endIndex, items.length)} of ${items.length}`}
              </Typography>
              <ConceptPropertiesPageButtons
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
            <RxEyeNone size={16} sx={{ color: 'text.secondary' }} />
          </Box>
        )}
        {!showEmptyIcon && (
          <Box
            onClick={handleToggle}
            sx={{
              mr: -0.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'action.hover',
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
        <ConceptPropertiesSection
          disablePagination={true}
          hideEmptyState={true}
          isLoading={isLoading}
          items={paginatedItems}
          loadingText={loadingText}
          renderComponent={renderComponent}
          renderItem={renderItem}
          title=''
        />
      </AccordionDetails>
    </Accordion>
  )
}

export default CollapsibleConceptPropertiesSection
