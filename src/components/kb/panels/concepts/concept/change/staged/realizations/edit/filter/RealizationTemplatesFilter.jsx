import { useMemo, useState, useEffect } from 'react'

import ControlledConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ControlledConceptPropertiesSection'
import RealizationTemplate from './RealizationTemplate'
import useAvailableLinkTemplates from '../useAvailableLinkTemplates'

const RealizationTemplatesFilter = ({ isLoading, linkName, onTemplateSelect, currentPage, onPageChange }) => {
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
    <ControlledConceptPropertiesSection
      fixedHeight={180}
      items={availableTemplates}
      isLoading={isLoading}
      loadingText='Loading templates...'
      renderItem={renderItem}
      title='Available Templates'
      currentPage={activePage}
      onPageChange={isControlled ? onPageChange : setInternalPage}
    />
  )
}

export default RealizationTemplatesFilter
