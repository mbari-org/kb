import { use, useCallback, useState } from 'react'

import PropertyAddIcon from '@/components/icon/property/PropertyAddIcon'
import PropertyDeleteIcon from '@/components/icon/property/PropertyDeleteIcon'
import PropertyEditIcon from '@/components/icon/property/PropertyEditIcon'

import createTemplateModal from '@/components/kb/panels/concepts/concept/change/staged/templates/createTemplateModal'
import createTemplateOnClose from '@/components/kb/panels/concepts/concept/change/staged/templates/createTemplateOnClose'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { EMPTY_TEMPLATE } from '@/lib/model/templates'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/lib/config'

const { TEMPLATE } = CONFIG.PANELS.CONCEPTS.MODALS

const ADD = CONCEPT_STATE.TEMPLATE.ADD
const DELETE = CONCEPT_STATE.TEMPLATE.DELETE

const TemplateActionIcon = ({ action, size, templateStateId }) => {
  const { concept, initialState } = use(ConceptContext)
  const { modifyConcept, stagedState } = use(ConceptStagedContext)
  const { setModal, setModalData } = use(ConceptModalContext)
  const [asyncError, setAsyncError] = useState(null)

  if (asyncError) {
    throw asyncError
  }

  const tooltip = action === ADD ? TEMPLATE.ADD.TOOLTIP : action === DELETE ? TEMPLATE.DELETE.TOOLTIP : TEMPLATE.EDIT.TOOLTIP

  const onClick = useCallback(() => {
    try {
      const newTemplate = { ...EMPTY_TEMPLATE, concept: concept.name }
      const templateItem =
        action === ADD ? { ...newTemplate } : { ...stagedState.templates.find(item => item.stateId === templateStateId) }

      setModalData({
        action,
        hasChanges: false,
        isDuplicate: false,
        original: action === ADD ? newTemplate : { ...templateItem },
        templateItem,
        templateStateId,
      })

      const modal = createTemplateModal(action)
      const onClose = createTemplateOnClose({ initialState, modifyConcept })
      setModal(modal, onClose)
    } catch (error) {
      setAsyncError(error)
    }
  }, [action, concept.name, initialState, modifyConcept, setModal, setModalData, stagedState.templates, templateStateId])

  const IconComponent = action === ADD ? PropertyAddIcon : action === DELETE ? PropertyDeleteIcon : PropertyEditIcon

  return <IconComponent colorOnHover={action !== ADD} onClick={onClick} size={size} tooltip={tooltip} />
}

export default TemplateActionIcon
