const addedConcepts = (parent, updatesInfo) => {
  const { updatedValue } = updatesInfo
  return updatedValue('children').map(child => ({
    ...child,
    aliases: [],
    alternateNames: [],
    realizations: [],
    media: [],
    parent,
    references: [],
  }))
}

// const fetchChildren = async (conceptName, apiFns) => {
//   const children = await apiFns.apiPayload(getConceptChildren, conceptName)
//   await Promise.all(
//     children.map(async child => {
//       child.parent = conceptName
//     })
//   )
//   return children
// }

// const fetchConcept = async (conceptName, apiFns) => {
//   const concept = await apiFns.apiPayload(getConcept, conceptName)
//   return concept
// }

// const fetchConceptNames = async (concept, apiFns) => {
//   const conceptNames = await apiFns.apiPayload(getConceptNames, concept.name)
//   return conceptNames
// }

// const fetchParent = async (conceptName, apiFns) => apiFns.apiPayload(getConceptParent, conceptName)

const getNextSibling = (concept, getConcept) => {
  const parent = getConcept(concept.parent)
  if (concept && parent) {
    const siblings = parent.children
    const currentIndex = siblings.findIndex(sibling => sibling === concept.name)

    if (currentIndex !== -1 && currentIndex < siblings.length - 1) {
      return siblings[currentIndex + 1]
    }
  }
  return null
}

const getPrevSibling = (concept, getConcept) => {
  const parent = getConcept(concept.parent)
  if (concept && parent) {
    const siblings = parent.children
    const currentIndex = siblings.findIndex(sibling => sibling === concept.name)

    if (currentIndex > 0) {
      return siblings[currentIndex - 1]
    }
  }

  return null
}

// const refresh = async (conceptName, apiFns) => {
//   const freshConcept = await fetchConcept(conceptName, apiFns)
//   const parent = await loadParent(conceptName, apiFns)
//   freshConcept.parent = parent.name
//   const children = await loadChildren(conceptName, apiFns)
//   freshConcept.children = children.map(child => child.name)
//   await loadConceptData(freshConcept, apiFns)

//   return freshConcept
// }

export {
  addedConcepts,
  // fetchChildren,
  // fetchConcept,
  // fetchConceptNames,
  // fetchParent,
  getNextSibling,
  getPrevSibling,
}
