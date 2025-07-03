import { use } from 'react'

import { createActions } from '@/components/modal/conceptModalFactory'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

import { LABELS } from '@/lib/constants'

const { DISCARD, STAGE } = LABELS.BUTTON

const DeleteMediaActions = () => {
  const {
    stagedState: { media, mediaIndex },
    modifyConcept,
  } = use(ConceptContext)
  const { closeModal } = use(ConceptModalContext)

  const colors = ['cancel', 'main']
  const labels = [DISCARD, STAGE]

  const onAction = label => {
    if (label === STAGE) {
      modifyConcept({
        type: CONCEPT_STATE.MEDIA.DELETE,
        update: {
          mediaIndex,
          mediaItem: { ...media[mediaIndex], action: CONCEPT_STATE.MEDIA.DELETE },
        },
      })
    }
    closeModal()
  }

  return createActions({ colors, labels, onAction }, 'DeleteMediaActions')
}

export default DeleteMediaActions
