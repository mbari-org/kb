import { use, useCallback } from 'react'

import AddChildActions from './AddChildActions'
import AddChildContent from './AddChildContent'
import AddChildTitle from './AddChildTitle'

import { createModal } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

const { RESET } = CONCEPT_STATE
const { ADD_CHILD } = CONCEPT_STATE.STRUCTURE

const addChildModal = () => {
  const components = {
    Actions: AddChildActions,
    Content: AddChildContent,
    Title: AddChildTitle,
  }

  return createModal(components)
}

const addChildOnClose = modifyConcept => {
  return modalData => {
    if (modalData.modified) {
      modifyConcept({
        type: RESET.ADD_CHILD,
        update: {
          child: modalData.child,
        },
      })
      return false
    }
    return true
  }
}

const initialModalData = {
  action: ADD_CHILD,
  child: {
    author: '',
    name: '',
    rankLevel: '',
    rankName: '',
  },
  modified: false,
}

const useAddChild = closeChoices => {
  const { modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(() => {
    closeChoices()

    const modal = addChildModal()
    const onClose = addChildOnClose(modifyConcept)
    setModal(modal, onClose)

    setModalData(initialModalData)
  }, [closeChoices, modifyConcept, setModal, setModalData])
}

export default useAddChild
