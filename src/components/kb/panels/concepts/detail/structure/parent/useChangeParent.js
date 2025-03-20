import { use, useCallback } from 'react'
import ChangeParentActions from './ChangeParentActions'
import ChangeParentContent from './ChangeParentContent'
import ChangeParentTitle from './ChangeParentTitle'

import { createModal } from '@/components/modal/factory'
import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const useChangeParent = () => {
  const { setModal } = use(ModalContext)
  const { modifyConcept } = use(ConceptContext)

  return useCallback(() => {
    const components = {
      Actions: ChangeParentActions,
      Content: ChangeParentContent,
      Title: ChangeParentTitle,
    }

    const modal = createModal(components)
    const defaultClose = () => modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.NO })
    setModal(modal, defaultClose)
  }, [modifyConcept, setModal])
}

export default useChangeParent
