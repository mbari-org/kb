// import { updateConceptMedia } from "@/lib/services/oni/api/concept"

import { updatedFields } from '@/lib/util'

const updateMedia = async (updates, result, process) => {
  const mediaUpdates = updatedFields(updates, ['media'])

  if (!mediaUpdates) {
    return result
  }

  const { media } = mediaUpdates

  let mediaResult = { ...result }

  const cxInc = null
  return process(cxInc, { media }, mediaResult)
}

export default updateMedia
