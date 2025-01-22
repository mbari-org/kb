import { useCallback } from "react"

const useMediaActions = _setMedia => {
  const addMedia = useCallback(mediaIndex => {
    console.log("CxTBD Add media after index:", mediaIndex)
    // const newMedia = {}
    // const updatedMedia = [...conceptMedia, ...newMedia]
    // setConceptMedia(updatedMedia)
  }, [])

  const deleteMedia = useCallback(mediaIndex => {
    console.log("CxTBD Delete media at index:", mediaIndex)
    // const updatedMedia = [...conceptMedia]
    // updatedMedia.splice(mediaIndex, 1)
    // setConceptMedia(updatedMedia)
  }, [])

  const editMedia = useCallback(mediaIndex => {
    console.log("CxTBD Edit media at index:", mediaIndex)
    // const updatedMedia = [...media, ...newMedia]
    // setMedia(media)
  }, [])

  return { addMedia, deleteMedia, editMedia }
}

export default useMediaActions
