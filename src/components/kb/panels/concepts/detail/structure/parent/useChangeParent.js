import { use, useCallback } from 'react'
import ChangeParentActions from './ChangeParentActions'
import ChangeParentContent from './ChangeParentContent'
import ChangeParentTitle from './ChangeParentTitle'

import { createModal } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

const { RESET } = CONCEPT_STATE
const { CHANGE_PARENT } = CONCEPT_STATE.STRUCTURE

const changeParentModal = () => {
  const components = {
    Actions: ChangeParentActions,
    Content: ChangeParentContent,
    Title: ChangeParentTitle,
  }
  return createModal(components)
}

const changeParentOnClose = modifyConcept => {
  return modalData => {
    if (modalData.modified) {
      modifyConcept({
        type: RESET.CHANGE_PARENT,
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
  action: CHANGE_PARENT,
  modified: false,
  parent: '',
}

const useChangeParent = closeChoices => {
  const { modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(() => {
    closeChoices()

    const modal = changeParentModal()
    const onClose = changeParentOnClose(modifyConcept)
    setModal(modal, onClose)

    setModalData(initialModalData)
  }, [closeChoices, modifyConcept, setModal, setModalData])
}

export default useChangeParent
