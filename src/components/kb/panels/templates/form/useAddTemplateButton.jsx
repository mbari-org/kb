import { use, useCallback, useMemo } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'
import ConceptTitle from '@/components/common/ConceptTitle'
import Actions from '@/components/common/factory/Actions'

import { useTemplatesModalOperationsContext, useTemplatesModalDataContext } from '@/contexts/panels/templates/modal'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

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
  discardEditsAlert,
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

  const addTemplateModal = useCallback(() => {
    const onClose = createTemplateOnClose(updateModalData)

    const ActionView = () => {
      const { modalData } = useTemplatesModalDataContext()

      // In confirm-discard, render explicit Discard/Continue that close or continue
      if (modalData?.confirmDiscard) {
        const colors = ['cancel', 'main']
        const disabled = [false, false]
        const labels = ['Discard', 'Continue']
        const onAction = label => {
          if (label === 'Discard') {
            closeModal()
          } else {
            updateModalData({ confirmDiscard: false, alert: null })
          }
        }
        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const actions = createModalActions(handleCancel, handleCommit, updateModalData)(modalData)
      if (!Array.isArray(actions)) return null

      const colors = actions.map(a => a.color || 'main')
      const disabled = actions.map(a => a.disabled || false)
      const labels = actions.map((a, i) => (i === 0 && modalData?.hasChanges ? 'Discard' : a.label))

      const onAction = label => {
        if (label === 'Discard') {
          updateModalData({ confirmDiscard: true, alert: discardEditsAlert() })
          return
        }
        const a = actions.find(x => x.label === label)
        if (a && a.onClick) a.onClick()
      }

      return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
    }

    const ContentView = () => {
      const { modalData } = useTemplatesModalDataContext()
      const TemplateModalContent = createModalContent(handleFormChange, false)
      return TemplateModalContent(modalData)
    }

    createModal({
      actionsComponent: ActionView,
      contentComponent: ContentView,
      titleComponent: ConceptTitle,
      data: {
        confirmDiscard: false,
        hasChanges: false,
        isValid: false,
        template: {
          ...EMPTY_TEMPLATE,
          concept: filters[SELECTED.SETTINGS.TEMPLATES.FILTERS.CONCEPT],
        },
      },
      onClose,
    })
  }, [closeModal, createModal, filters, handleCancel, handleCommit, handleFormChange, updateModalData])

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
