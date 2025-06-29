import { use, useCallback } from 'react'

import AddChildActions from './AddChildActions'
import AddChildContent from './AddChildContent'
import AddChildTitle from './AddChildTitle'

import { createModal } from '@/components/modal/factory'

import PanelModalContext from '@/contexts/modal/PanelModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

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
    // Handle case where modalData is null (defensive programming)
    if (!modalData) {
      return true
    }

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
  const { setModal, setModalData } = use(PanelModalContext)

  return useCallback(() => {
    closeChoices()

    const modal = addChildModal()
    const onClose = addChildOnClose(modifyConcept)
    setModal(modal, onClose)

    setModalData(initialModalData)
  }, [closeChoices, modifyConcept, setModal, setModalData])
}

export default useAddChild
