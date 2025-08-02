import { Box } from '@mui/material'

import ConceptSectionTitle from '@/components/common/ConceptSectionTitle'
import ConceptPropertiesCount from './ConceptPropertiesCount'
import ConceptPropertiesDisclosure from './ConceptPropertiesDisclosure'

const ConceptPropertiesSummary = ({
  children,
  currentPage,
  disablePagination,
  expanded,
  fixedHeight,
  handleToggle,
  hasItems,
  IconComponent,
  itemsPerPage,
  onPageChange,
  onPageTextClick,
  showEmptyIcon,
  title,
  totalItems,
}) => {
  return (
    <ConceptSectionTitle title={title} IconComponent={IconComponent}>
      <Box sx={{ ml: 2, flex: 1 }}>{children}</Box>
      <ConceptPropertiesCount
        currentPage={currentPage}
        disablePagination={disablePagination}
        hasItems={hasItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onPageTextClick={onPageTextClick}
        showEmptyIcon={showEmptyIcon}
        totalItems={totalItems}
      />
      {!showEmptyIcon && fixedHeight === undefined && (
        <ConceptPropertiesDisclosure expanded={expanded} onToggle={handleToggle} />
      )}
    </ConceptSectionTitle>
  )
}

export default ConceptPropertiesSummary
