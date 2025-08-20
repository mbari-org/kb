import { use, useCallback } from 'react'

import PropertyAddIcon from '@/components/common/icon/property/PropertyAddIcon'
import PropertyDeleteIcon from '@/components/common/icon/property/PropertyDeleteIcon'
import PropertyEditIcon from '@/components/common/icon/property/PropertyEditIcon'

import createRealizationModal from '@/components/kb/panels/concepts/concept/change/staged/realizations/createRealizationModal'
import createRealizationOnClose from '@/components/kb/panels/concepts/concept/change/staged/realizations/createRealizationOnClose'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { EMPTY_TEMPLATE } from '@/lib/kb/model/template'

import { CONCEPT_STATE } from '@/lib/constants'

const ADD = CONCEPT_STATE.REALIZATION.ADD
const DELETE = CONCEPT_STATE.REALIZATION.DELETE

const RealizationEditIcon = ({ action, realizationIndex, size }) => {
  const { initialState, modifyConcept, stagedState } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const onClick = useCallback(() => {
    const realizationItem =
      action === ADD ? EMPTY_TEMPLATE : stagedState.realizations[realizationIndex]

    const modalData = {
      action,
      modified: { linkName: false, toConcept: false, linkValue: false },
      realizationIndex,
      realizationItem,
    }
    setModalData(modalData)

    const modal = createRealizationModal(action)
    const onClose = createRealizationOnClose({ initialState, modifyConcept })

    setModal(modal, onClose)
  }, [action, realizationIndex, initialState, modifyConcept, setModal, setModalData, stagedState])

  const IconComponent =
    action === ADD ? PropertyAddIcon : action === DELETE ? PropertyDeleteIcon : PropertyEditIcon

  return <IconComponent onClick={onClick} size={size} />
}

export default RealizationEditIcon
