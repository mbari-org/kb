import { use } from 'react'

import { createActions } from '@/components/modal/panelModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

import { LABELS } from '@/lib/constants'

const { DISCARD, STAGE } = LABELS.BUTTON

const DeleteAliasActions = () => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData } = use(ConceptModalContext)
  const { alias, aliasIndex } = modalData

  const colors = ['cancel', 'main']
  const labels = [DISCARD, STAGE]

  const onAction = label => {
    if (label === STAGE) {
      modifyConcept({
        type: CONCEPT_STATE.ALIAS.DELETE,
        update: {
          aliasIndex,
          alias: { ...alias, action: CONCEPT_STATE.ALIAS.DELETE },
        },
      })
    }
    closeModal()
  }

  return createActions({ colors, labels, onAction }, 'DeleteAliasActions')
}

export default DeleteAliasActions
