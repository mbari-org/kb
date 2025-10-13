import { useEffect, useState } from 'react'
import BaseConceptPropertyPages from './BaseConceptPropertyPages'

const ConceptPropertyPages = ({
  defaultExpanded = true,
  disablePagination = false,
  fixedHeight,
  iconComponent,
  isLoading = false,
  items = [],
  loadingText = 'Loading...',
  renderComponent = null,
  renderItem,
  title,
}) => {
  const [page, setPage] = useState(0)

  useEffect(() => {
    const timeoutId = setTimeout(() => setPage(0), 0)
    return () => clearTimeout(timeoutId)
  }, [items])

  return (
    <BaseConceptPropertyPages
      currentPage={page}
      defaultExpanded={defaultExpanded}
      disablePagination={disablePagination}
      fixedHeight={fixedHeight}
      iconComponent={iconComponent}
      isLoading={isLoading}
      items={items}
      loadingText={loadingText}
      onPageChange={newPage => setPage(newPage)}
      renderComponent={renderComponent}
      renderItem={renderItem}
      title={title}
    />
  )
}

export default ConceptPropertyPages
