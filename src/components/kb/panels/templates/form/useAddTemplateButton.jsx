import { use, useCallback, useMemo } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'
import ConceptTitle from '@/components/common/ConceptTitle'

import { useTemplatesModalOperationsContext } from '@/contexts/panels/templates/modal'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'

import { EMPTY_TEMPLATE } from '@/lib/kb/model/realization'

import { PROCESSING, SELECTED } from '@/lib/constants'

import {
  createModalActions,
  createTemplateValidator,
  processAddTemplateData,
  createHandlers,
  createModalContent,
  createTemplateOnClose,
  duplicateTemplateAlert,
  isDuplicateTemplate,
} from '@/components/kb/panels/templates/form/templateModalUtils'

const { SAVING } = PROCESSING

const useAddTemplateButton = () => {
  const { addTemplate, filters } = use(TemplatesContext)
  const { templates: allTemplates } = use(PanelDataContext)

  const { closeModal, createModal, updateModalData, setProcessing } =
    useTemplatesModalOperationsContext()

  const { handleCancel, handleFormChange } = useMemo(
    () => createHandlers(updateModalData, closeModal, false),
    [updateModalData, closeModal]
  )

  const handleCommit = useCallback(
    async template => {
      try {
        const validateTemplate = createTemplateValidator(false)
        if (!validateTemplate(template)) {
          return
        }

        // Duplicate check: exact match on concept + linkName + toConcept + linkValue
        if (isDuplicateTemplate(allTemplates, template)) {
          updateModalData({ alert: duplicateTemplateAlert() })
          return
        }

        setProcessing(SAVING)

        const templateData = processAddTemplateData(template)
        await addTemplate(templateData)
        closeModal()
      } catch (error) {
        setProcessing(false)
        throw error
      }
    },
    [addTemplate, allTemplates, closeModal, setProcessing, updateModalData]
  )

  const content = useCallback(
    currentModalData => createModalContent(handleFormChange, false)(currentModalData),
    [handleFormChange]
  )

  const addTemplateModal = useCallback(() => {
    const onClose = createTemplateOnClose(updateModalData)

    createModal({
      content,
      actions: createModalActions(handleCancel, handleCommit, updateModalData),
      data: {
        confirmDiscard: false,
        hasChanges: false,
        isValid: false,
        template: {
          ...EMPTY_TEMPLATE,
          concept: filters[SELECTED.SETTINGS.TEMPLATES.FILTERS.CONCEPT],
        },
      },
      titleComponent: ConceptTitle,
      onClose,
    })
  }, [content, createModal, filters, handleCancel, handleCommit, updateModalData])

  const AddTemplateButton = useCallback(() => {
    const { TEMPLATES } = SELECTED.SETTINGS
    const conceptSelected = Boolean(filters?.[TEMPLATES.FILTERS.CONCEPT])
    const tooltip = conceptSelected
      ? 'Add Template to Selected Concept'
      : 'Select Concept to Add Template'

    return (
      <PanelAddButton disabled={!conceptSelected} onClick={addTemplateModal} tooltip={tooltip} />
    )
  }, [addTemplateModal, filters])

  return AddTemplateButton
}

export default useAddTemplateButton
