const getConceptName = concept => concept.name
const getConceptLabel = concept =>
  concept.alternateNames.length === 0
    ? concept.name
    : `${concept.name} (${concept.alternateNames.join(", ")})`

const getConceptPath = (taxonomy, concept, path = []) =>
  !!concept.parent
    ? getConceptPath(taxonomy, concept.parent, [concept.name, ...path])
    : [concept.name, ...path]

export { getConceptLabel, getConceptName, getConceptPath }
