import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { createModal } from '@/components/modal/factory'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

const useCreateEditingModal = (components, onClose) => {
  const { setModal } = use(ModalContext)
  const { modifyConcept } = use(ConceptContext)

  return useCallback(() => {
    const modal = createModal(components)
    const defaultClose = () => modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.NO })
    setModal(modal, onClose || defaultClose)
  }, [components, modifyConcept, onClose, setModal])
}

export default useCreateEditingModal
