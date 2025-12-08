import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'

import AddChildActions from './AddChildActions'
import AddChildContent from './AddChildContent'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { EMPTY_CHILD } from '@/lib/kb/model/children'

import { CONCEPT_STATE } from '@/constants/conceptState.js'

import { hasTrue } from '@/lib/utils'

const { CHILD, RESET } = CONCEPT_STATE

const addChildModal = () => {
  const components = {
    Actions: AddChildActions,
    Content: AddChildContent,
    Title: ConceptTitle,
  }

  return createModal(components)
}

const addChildOnClose = (modifyConcept, stagedChildren) => {
  return modalData => {
    if (hasTrue(modalData.modified)) {
      modifyConcept({
        type: RESET.CHILDREN,
        update: {
          index: stagedChildren.length,
        },
      })
      return false
    }
    return true
  }
}

const useAddChildModal = () => {
  const { modifyConcept, stagedState } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  return useCallback(() => {
    const modal = addChildModal()
    const onClose = addChildOnClose(modifyConcept, stagedState.children)

    // Set modal data first, then render the modal
    setModalData({
      action: CHILD.ADD,
      child: EMPTY_CHILD,
      index: stagedState.children.length,
      modified: false,
    })

    setModal(modal, onClose)
  }, [modifyConcept, setModal, setModalData, stagedState.children])
}

export default useAddChildModal
