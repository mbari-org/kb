import { use, useCallback } from 'react'

import ChangeNameActions from './ChangeNameActions'
import ChangeNameContent from './ChangeNameContent'
import ChangeNameTitle from './ChangeNameTitle'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE
const { CHANGE_NAME } = CONCEPT_STATE.STRUCTURE

const changeNameModal = () => {
  const components = {
    Actions: ChangeNameActions,
    Content: ChangeNameContent,
    Title: ChangeNameTitle,
  }
  return createModal(components)
}

const changeNameOnClose = modifyConcept => {
  return modalData => {
    // Handle case where modalData is null (defensive programming)
    if (!modalData) {
      return true
    }

    if (modalData.modified) {
      modifyConcept({
        type: RESET.CHANGE_NAME,
        update: {
          name: modalData.name,
        },
      })
      return false
    }
    return true
  }
}

const initialModalData = {
  action: CHANGE_NAME,
  modified: false,
  name: '',
}

const useChangeName = closeChoices => {
  const { modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  return useCallback(() => {
    closeChoices()

    const modal = changeNameModal()
    const onClose = changeNameOnClose(modifyConcept)
    setModal(modal, onClose)

    setModalData(initialModalData)
  }, [closeChoices, modifyConcept, setModal, setModalData])
}

export default useChangeName
