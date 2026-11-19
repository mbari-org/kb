import { use, useCallback, useMemo } from 'react'

import TemplateForm from '@/components/kb/panels/templates/form/TemplateForm'
import useAvailableLinkTemplates from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/useAvailableLinkTemplates'
import { linkNameOptionsOf } from '@/components/kb/panels/templates/form/templateModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import { REALIZATION_VALUE_FIELDS } from '@/lib/model/realization'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { TEMPLATE } = CONCEPT_STATE

const EditTemplateContent = () => {
  const { concept } = use(ConceptContext)
  const { stagedState } = use(ConceptStagedContext)
  const { setModalData } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)
  const getAvailableLinkTemplates = useAvailableLinkTemplates()

  const { action, original, templateItem, templateStateId } = modalData

  const linkNameOptions = useMemo(
    () => linkNameOptionsOf(getAvailableLinkTemplates(), concept.name),
    [concept.name, getAvailableLinkTemplates]
  )

  const existingTemplates = useMemo(
    () => stagedState.templates.filter(item => item.action !== TEMPLATE.DELETE && item.stateId !== templateStateId),
    [stagedState.templates, templateStateId]
  )

  const handleFormChange = useCallback(
    updatedTemplate => {
      setModalData(prev => ({
        ...prev,
        hasChanges: REALIZATION_VALUE_FIELDS.some(field => updatedTemplate[field] !== prev.original[field]),
        templateItem: updatedTemplate,
      }))
    },
    [setModalData]
  )

  const handleDuplicateChange = useCallback(
    isDuplicate => {
      setModalData(prev => ({ ...prev, isDuplicate }))
    },
    [setModalData]
  )

  return (
    <TemplateForm
      existingTemplates={existingTemplates}
      isEdit={action === TEMPLATE.EDIT}
      linkNameOptions={linkNameOptions}
      onChange={handleFormChange}
      onDuplicateChange={handleDuplicateChange}
      original={original}
      template={templateItem}
    />
  )
}

export default EditTemplateContent
