// import { updateConceptMedia } from "@/lib/services/oni/api/concept"

const updateMedia = async (updates, result, nextResult) => {
  const { media } = updates

  let mediaResult = { ...result }

  if (media) {
    const cxInc = null
    mediaResult = await nextResult(result, { media }, cxInc)
  }

  return mediaResult
}

export default updateMedia
