import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const useHandleMediaSubmit = (mediaIndex, setModal) => {
  const { editingState, modifyConcept } = use(ConceptContext)

  const mediaItem = editingState.media[mediaIndex]

  const handleSubmit = async event => {
    event.preventDefault()

    const type =
      mediaIndex === editingState.media.length ? CONCEPT_STATE.MEDIA.ADD : CONCEPT_STATE.MEDIA.EDIT

    modifyConcept({
      type,
      update: {
        mediaIndex,
        mediaItem,
      },
    })

    if (type === CONCEPT_STATE.MEDIA.ADD) {
      editingState.mediaIndex = mediaIndex
    }

    setModal(null)
  }

  return handleSubmit
}

export default useHandleMediaSubmit
