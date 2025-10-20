const sortConcepts = concepts => [...(concepts || [])].sort((a, b) => a.localeCompare(b))

const createReference = (data = {}) => ({
  id: data.id,
  citation: data.citation || '',
  doi: data.doi || '',
  concepts: sortConcepts(data.concepts),
})

const updateReference = (reference, updates) =>
  createReference({
    ...reference,
    ...updates,
    concepts: sortConcepts(updates.concepts || reference.concepts),
  })

export { createReference, updateReference }
