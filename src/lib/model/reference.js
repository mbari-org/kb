import { pick } from '@/lib/utils'

const REFERENCE_FIELDS = ['citation', 'doi', 'concepts']

const sortConcepts = concepts => [...(concepts || [])].sort((a, b) => a.localeCompare(b))

const createReference = (data = {}) => ({
  id: data.id,
  citation: data.citation || '',
  doi: data.doi || '',
  concepts: sortConcepts(data.concepts),
})

const pickReference = object => pick(object, REFERENCE_FIELDS)

const updateReference = (reference, updates) =>
  createReference({
    ...reference,
    ...updates,
    concepts: sortConcepts(updates.concepts || reference.concepts),
  })

export { createReference, pickReference, updateReference }
