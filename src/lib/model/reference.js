import { getConcept as getConceptApi } from '@/lib/api/concept'
import { pick } from '@/lib/utils'

const REFERENCE_FIELDS = ['citation', 'doi', 'concepts']

const sortConcepts = concepts => [...(concepts || [])].sort((a, b) => a.localeCompare(b))

const createReference = (data = {}) => ({
  id: data.id,
  citation: data.citation || '',
  doi: data.doi || '',
  concepts: sortConcepts(data.concepts),
})

const loadReferences = async (apiFns, concept) => {
  if (concept.references) {
    return concept.references
  }
  const refreshedConcept = await apiFns.apiPayload(getConceptApi, concept.name)
  return refreshedConcept.references || []
}

const pickReference = object => pick(object, REFERENCE_FIELDS)

const updateReference = (reference, updates) =>
  createReference({
    ...reference,
    ...updates,
    concepts: sortConcepts(updates.concepts || reference.concepts),
  })

export { createReference, loadReferences, pickReference, updateReference }
