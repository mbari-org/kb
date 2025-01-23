import { use, useCallback } from "react"

import ConceptContext from "@/contexts/concept/ConceptContext"

import useDisplayDeleteMedia from "./deleteMedia/useDisplayDeleteMedia"

const useMediaActions = _setMedia => {
  const { concept } = use(ConceptContext)

  const displayDeleteMedia = useDisplayDeleteMedia()

  const getMedia = useCallback(
    mediaIndex => concept.media[mediaIndex],
    [concept.media]
  )

  const addMedia = useCallback(mediaIndex => {
    console.log("CxTBD Add media after index:", mediaIndex)

    // const newMedia = {}
    // const updatedMedia = [...conceptMedia, ...newMedia]
    // setConceptMedia(updatedMedia)
  }, [])

  const deleteMedia = useCallback(
    mediaIndex => {
      displayDeleteMedia(mediaIndex)

      // const updatedMedia = [...conceptMedia]
      // updatedMedia.splice(mediaIndex, 1)
      // setConceptMedia(updatedMedia)
    },
    [displayDeleteMedia]
  )

  const editMedia = useCallback(
    mediaIndex => {
      const mediaItem = getMedia(mediaIndex)
      console.log("CxTBD Edit media:", mediaItem)

      // const updatedMedia = [...media, ...newMedia]
      // setMedia(media)
    },
    [getMedia]
  )

  return { addMedia, deleteMedia, editMedia }
}

export default useMediaActions
