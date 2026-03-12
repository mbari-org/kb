import createAppModal from '@/components/modal/app/createAppModal'
import {
  ConceptRealizationModalActions,
  ConceptRealizationModalContent,
  ConceptRealizationModalTitle,
} from '@/components/kb/panels/concepts/concept/detail/realizations/ConceptRealizationModalComponents'
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const getDynamicMinWidth = realization => {
  const linkValueLength = realization?.linkValue?.length || 0
  const estimatedWidth = 500 + linkValueLength * 4
  const viewportMaxWidth = typeof window === 'undefined' ? 1200 : Math.floor(window.innerWidth * 0.75)

  return clamp(estimatedWidth, 500, viewportMaxWidth)
}

const createConceptRealizationModal = realization =>
  createAppModal({
    Actions: ConceptRealizationModalActions,
    Content: ConceptRealizationModalContent,
    Title: ConceptRealizationModalTitle,
    minWidth: getDynamicMinWidth(realization),
    maxWidth: '75vw',
    focusClose: true,
  })

export default createConceptRealizationModal
