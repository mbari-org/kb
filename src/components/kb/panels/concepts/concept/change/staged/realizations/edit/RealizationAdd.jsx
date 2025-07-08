import { use, useCallback } from 'react'

import PropertyAddIcon from '@/components/common/icon/property/PropertyAddIcon'

import createEditRealizationModal from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/createEditRealizationModal'
import createEditRealizationOnClose from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/createEditRealizationOnClose'

import { EMPTY_REALIZATION_ITEM } from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/realizationItem'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const RealizationAdd = ({ sx }) => {
  const { stagedState, initialState, modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const handleClick = useCallback(() => {
    const realizationIndex = stagedState.realizations.length
    const realizationItem = EMPTY_REALIZATION_ITEM

    const modalData = {
      action: CONCEPT_STATE.REALIZATION.ADD,
      realizationIndex,
      realizationItem,
      modified: false,
    }
    setModalData(modalData)

    const modal = createEditRealizationModal(CONCEPT_STATE.REALIZATION.ADD)
    const onClose = createEditRealizationOnClose({ initialState, modifyConcept })

    setModal(modal, onClose)
  }, [stagedState.realizations.length, initialState, modifyConcept, setModal, setModalData])

  return <PropertyAddIcon onClick={handleClick} size={24} sx={sx} />
}

export default RealizationAdd
