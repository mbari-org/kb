import { useMemo, useState, useEffect } from 'react'

import ControlledConceptPropertyPages from '@/components/kb/panels/concepts/concept/detail/properties/ControlledConceptPropertyPages'
import RealizationTemplate from './RealizationTemplate'
import useAvailableLinkTemplates from '../useAvailableLinkTemplates'

const RealizationTemplatesFilter = ({
  isLoading,
  linkName,
  onTemplateSelect,
  currentPage,
  onPageChange,
}) => {
  const getAvailableLinkTemplates = useAvailableLinkTemplates()

  // Use controlled pagination if provided, otherwise use internal state
  const [internalPage, setInternalPage] = useState(0)
  const isControlled = currentPage !== undefined && onPageChange !== undefined
  const activePage = isControlled ? currentPage : internalPage

  const availableTemplates = useMemo(() => {
    return getAvailableLinkTemplates(linkName)
  }, [getAvailableLinkTemplates, linkName])

  // Reset internal page when templates change and not controlled
  useEffect(() => {
    if (!isControlled) {
      setInternalPage(0)
    }
  }, [linkName, isControlled]) // Only reset when linkName changes, not when templates array reference changes

  const renderItem = {
    key: (template, index) => `${template.concept}-${template.linkName}-${index}`,
    content: template => (
      <RealizationTemplate template={template} onTemplateSelect={onTemplateSelect} />
    ),
  }

  return (
    <ControlledConceptPropertyPages
      currentPage={activePage}
      fixedHeight={180}
      isLoading={isLoading}
      items={availableTemplates}
      loadingText='Loading templates...'
      onPageChange={isControlled ? onPageChange : setInternalPage}
      renderItem={renderItem}
      title='Available Templates'
    />
  )
}

export default RealizationTemplatesFilter
