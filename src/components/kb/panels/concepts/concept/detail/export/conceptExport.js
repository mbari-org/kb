import { conceptNameForFilename } from '@/lib/utils'

import { CONCEPT } from '@/lib/constants'

const getSuggestedFileName = ({ concept, conceptExtent, extension }) => {
  const extent = conceptExtent !== CONCEPT.EXTENT.SOLO ? `_and_${conceptExtent}` : ''
  return `KB-Concepts_${conceptNameForFilename(concept.name)}${extent}.${extension}`
}

export { getSuggestedFileName }
