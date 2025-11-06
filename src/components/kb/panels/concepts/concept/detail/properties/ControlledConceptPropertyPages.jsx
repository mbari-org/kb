import BaseConceptPropertyPages from './BaseConceptPropertyPages'

const ControlledConceptPropertyPages = ({
  currentPage = 0,
  defaultExpanded = true,
  disablePagination = false,
  fixedHeight,
  actionComponent,
  isLoading = false,
  items = [],
  loadingText = 'Loading...',
  onPageChange,
  renderComponent = null,
  renderItem,
  title,
}) => {
  return (
    <BaseConceptPropertyPages
      currentPage={currentPage}
      defaultExpanded={defaultExpanded}
      disablePagination={disablePagination}
      fixedHeight={fixedHeight}
      actionComponent={actionComponent}
      isLoading={isLoading}
      items={items}
      loadingText={loadingText}
      onPageChange={onPageChange}
      renderComponent={renderComponent}
      renderItem={renderItem}
      title={title}
    />
  )
}

export default ControlledConceptPropertyPages
