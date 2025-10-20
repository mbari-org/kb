import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'
import ChangeNameActions from './ChangeNameActions'
import ChangeNameContent from './ChangeNameContent'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

import { hasTrue } from '@/lib/utils'

const { NAME, RESET } = CONCEPT_STATE

const changeNameModal = () => {
  const components = {
    Actions: ChangeNameActions,
    Content: ChangeNameContent,
    Title: ConceptTitle,
  }
  return createModal(components)
}

const changeNameOnClose = modifyConcept => {
  return modalData => {
    if (hasTrue(modalData.modified)) {
      modifyConcept({
        type: RESET.NAME,
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
  action: NAME,
  modified: false,
  name: '',
}

const useChangeNameModal = () => {
  const { modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  return useCallback(() => {
    const modal = changeNameModal()
    const onClose = changeNameOnClose(modifyConcept)
    setModal(modal, onClose)

    setModalData(initialModalData)
  }, [modifyConcept, setModal, setModalData])
}

export default useChangeNameModal
