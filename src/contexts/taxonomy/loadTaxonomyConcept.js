const loadTaxonomyConcept = async (taxonomy, conceptName) => {
  const concept = taxonomy[conceptName]
  if (!concept) {
    const root = taxonomy[taxonomy._root_]
    const loadFn = conceptName === taxonomy._root_ || !!root ? load : lineage

    const { error, taxonomy: updatedTaxonomy } = await loadFn(
      taxonomy,
      conceptName
    )
    if (!!error) {
      console.error("Handle loadConcept error:", error)
      return { error }
    } else {
      return { taxonomy: updatedTaxonomy }
    }
  }
}

export default loadTaxonomyConcept
