import { useState, useEffect } from 'react'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'

import ConceptPropertiesDetails from './ConceptPropertiesDetails'
import ConceptPropertiesSummary from './ConceptPropertiesSummary'

import { CONCEPT_PROPERTY_LIST } from '@/lib/constants'

const { ITEMS_PER_PAGE } = CONCEPT_PROPERTY_LIST

const ControlledConceptPropertyPages = ({
  children,
  currentPage = 0,
  defaultExpanded = true,
  disablePagination = false,
  fixedHeight,
  iconComponent,
  isLoading = false,
  items = [],
  loadingText = 'Loading...',
  onPageChange,
  renderComponent = null,
  renderItem,
  title,
}) => {
  const [expanded, setExpanded] = useState(fixedHeight !== undefined || defaultExpanded)
  const [animationDirection, setAnimationDirection] = useState('up')
  const rowsPerPage = ITEMS_PER_PAGE

  const hasItems = items?.length > 0
  const showEmptyIcon = !hasItems && !isLoading

  const [prevHasItems, setPrevHasItems] = useState(hasItems)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (showEmptyIcon && fixedHeight === undefined) {
        setExpanded(false)
      } else if (!prevHasItems && hasItems && fixedHeight === undefined) {
        setExpanded(true)
      }
      setPrevHasItems(hasItems)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [showEmptyIcon, fixedHeight, hasItems, prevHasItems])

  const handleToggle = () => {
    if (hasItems && fixedHeight === undefined) {
      setExpanded(!expanded)
    }
  }

  const handleChangePage = (newPage, direction) => {
    if (direction) {
      setAnimationDirection(direction)
    } else {
      const calculatedDirection = newPage > currentPage ? 'down' : 'up'
      setAnimationDirection(calculatedDirection)
    }

    if (onPageChange) {
      onPageChange(newPage, direction)
    }

    if (!expanded && fixedHeight === undefined) {
      setExpanded(true)
    }
  }

  return (
    <Accordion
      expanded={fixedHeight !== undefined || expanded}
      onChange={() => {}}
      sx={{
        boxShadow: 'none',
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        onClick={e => {
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
          currentPage={currentPage}
          disablePagination={disablePagination}
          expanded={expanded}
          fixedHeight={fixedHeight}
          handleToggle={handleToggle}
          hasItems={hasItems}
          iconComponent={iconComponent}
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
          currentPage={currentPage}
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

export default ControlledConceptPropertyPages
