import { use, useCallback } from 'react'

import PropertyAddIcon from '@/components/common/icon/property/PropertyAddIcon'
import PropertyDeleteIcon from '@/components/common/icon/property/PropertyDeleteIcon'
import PropertyEditIcon from '@/components/common/icon/property/PropertyEditIcon'

import createEditRealizationModal from '@/components/kb/panels/concepts/concept/change/staged/concept/realizations/edit/createEditRealizationModal'
import createEditRealizationOnClose from '@/components/kb/panels/concepts/concept/change/staged/concept/realizations/edit/createEditRealizationOnClose'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { EMPTY_REALIZATION_ITEM } from '@/components/kb/panels/concepts/concept/change/staged/concept/realizations/edit/realizationItem'

import { CONCEPT_STATE } from '@/lib/constants'

const ADD = CONCEPT_STATE.REALIZATION.ADD
const DELETE = CONCEPT_STATE.REALIZATION.DELETE

const RealizationModifyIcon = ({ action, realizationIndex, size }) => {
  const { initialState, modifyConcept, stagedState } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const onClick = useCallback(() => {
    const realization =
      action === ADD ? EMPTY_REALIZATION_ITEM : stagedState.realizations[realizationIndex]

    const actionModalData = {
      action,
      realizationIndex,
      realizationItem: realization,
      modified: false,
    }
    setModalData(actionModalData)

    const modal = createEditRealizationModal(action)
    const onClose = createEditRealizationOnClose({ initialState, modifyConcept })

    setModal(modal, onClose)
  }, [action, realizationIndex, initialState, modifyConcept, setModal, setModalData, stagedState])

  const IconComponent =
    action === ADD ? PropertyAddIcon : action === DELETE ? PropertyDeleteIcon : PropertyEditIcon

  return <IconComponent onClick={onClick} size={size} />
}

export default RealizationModifyIcon
