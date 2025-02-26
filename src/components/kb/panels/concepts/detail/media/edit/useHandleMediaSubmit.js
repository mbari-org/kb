import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { checkUrlExists, isValidUrl } from '@/lib/util'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

const useHandleMediaSubmit = (mediaIndex, data, setModal, setUrlStatus) => {
  const { editingState, modifyConcept } = use(ConceptContext)

  const handleSubmit = async e => {
    e.preventDefault()

    // check if URL is valid
    if (!isValidUrl(data.editing.url)) {
      return
    }

    // loading state
    setUrlStatus({ loading: true, valid: true })

    // check if URL is accessible
    const urlExists = await checkUrlExists(data.editing.url)
    setUrlStatus({ loading: false, valid: urlExists })

    if (!urlExists) {
      return
    }

    // proceed with concept media update
    const type =
      mediaIndex === editingState.media.length ? CONCEPT_STATE.MEDIA.ADD : CONCEPT_STATE.MEDIA.EDIT

    modifyConcept({
      type,
      update: {
        mediaIndex,
        mediaItem: data.editing,
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
