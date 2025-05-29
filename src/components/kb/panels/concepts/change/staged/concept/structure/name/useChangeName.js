import { use, useCallback } from 'react'

import ChangeNameActions from './ChangeNameActions'
import ChangeNameContent from './ChangeNameContent'
import ChangeNameTitle from './ChangeNameTitle'

import { createModal } from '@/components/modal/factory'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

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
  const { setModal, setModalData } = use(ModalContext)

  return useCallback(() => {
    closeChoices()

    const modal = changeNameModal()
    const onClose = changeNameOnClose(modifyConcept)
    setModal(modal, onClose)

    setModalData(initialModalData)
  }, [closeChoices, modifyConcept, setModal, setModalData])
}

export default useChangeName
