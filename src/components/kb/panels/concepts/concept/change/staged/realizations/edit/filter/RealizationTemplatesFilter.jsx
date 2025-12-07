import { useMemo, useState, useEffect } from 'react'

import ControlledConceptPropertyPages from '@/components/kb/panels/concepts/concept/detail/properties/ControlledConceptPropertyPages'
import RealizationTemplate from './RealizationTemplate'
import useAvailableLinkTemplates from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/useAvailableLinkTemplates'

const RealizationTemplatesFilter = ({
  currentPage,
  isLoading,
  linkName,
  onPageChange,
  onTemplateSelect,
}) => {
  const getAvailableLinkTemplates = useAvailableLinkTemplates()

  const [internalPage, setInternalPage] = useState(0)
  const isControlled = currentPage !== undefined && onPageChange !== undefined
  const activePage = isControlled ? currentPage : internalPage

  const availableTemplates = useMemo(() => {
    return getAvailableLinkTemplates(linkName)
  }, [getAvailableLinkTemplates, linkName])

  useEffect(() => {
    if (!isControlled) {
      const timeoutId = setTimeout(() => setInternalPage(0), 0)
      return () => clearTimeout(timeoutId)
    }
  }, [linkName, isControlled])

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
