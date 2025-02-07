import { use } from "react"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"

import { checkUrlExists, isValidUrl } from "@/lib/kb/util"

const useHandleMediaSubmit = (mediaIndex, data, setModal, setUrlStatus) => {
  const { editingState, modifyConcept } = use(ConceptContext)

  const handleSubmit = async e => {
    e.preventDefault()

    // First check if URL is valid
    if (!isValidUrl(data.editing.url)) {
      return
    }

    // Show loading state
    setUrlStatus({ loading: true, valid: true })

    // Check if URL is accessible
    const urlExists = await checkUrlExists(data.editing.url)
    setUrlStatus({ loading: false, valid: urlExists })

    if (!urlExists) {
      return
    }

    // Proceed with form submission
    const type =
      mediaIndex === editingState.media.length
        ? CONCEPT.MEDIA_ADD
        : CONCEPT.MEDIA_EDIT
    modifyConcept({
      type,
      update: {
        mediaIndex,
        mediaItem: data.editing,
      },
    })
    setModal(null)
  }

  return handleSubmit
}

export default useHandleMediaSubmit
