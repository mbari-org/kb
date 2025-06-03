/**
 * Sorts concepts array alphabetically
 * @private
 * @param {string[]} concepts - Array of concept names
 * @returns {string[]} Sorted array of concept names
 */
const sortConcepts = concepts => [...(concepts || [])].sort((a, b) => a.localeCompare(b))

/**
 * Creates a new reference object with sorted concepts
 * @param {Object} data - Raw reference data
 * @returns {Object} Reference object with sorted concepts
 */
const createReference = (data = {}) => ({
  id: data.id,
  citation: data.citation || '',
  doi: data.doi || '',
  concepts: sortConcepts(data.concepts),
})

/**
 * Creates a new reference object with updated fields
 * @param {Object} reference - Original reference object
 * @param {Object} updates - Fields to update
 * @returns {Object} New reference object with updates
 */
const updateReference = (reference, updates) =>
  createReference({
    ...reference,
    ...updates,
    concepts: sortConcepts(updates.concepts || reference.concepts),
  })

export { createReference, updateReference }
