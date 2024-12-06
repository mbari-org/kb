const itemConceptName = concept => concept.name

const itemConceptLabel = concept =>
  concept.alternateNames.length === 0
    ? concept.name
    : `${concept.name} (${concept.alternateNames.join(", ")})`

const itemConceptPath = (taxonomy, concept, path = [concept.name]) =>
  concept.parent
    ? itemConceptPath(taxonomy, concept.parent, [concept.name, ...path])
    : [concept.name, ...path]

export { itemConceptLabel, itemConceptName, itemConceptPath }
