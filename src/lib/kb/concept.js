import { NAME_TYPES } from './concept/names'

const getNextSibling = concept => {
  if (concept && concept.parent) {
    const siblings = concept.parent.children
    const currentIndex = siblings.findIndex(sibling => sibling.name === concept.name)

    if (currentIndex !== -1 && currentIndex < siblings.length - 1) {
      return siblings[currentIndex + 1]
    }
  }
  return null
}

const getPrevSibling = concept => {
  const { parent } = concept

  if (parent) {
    const siblings = parent.children
    const currentIndex = siblings.findIndex(sibling => sibling.name === concept.name)

    if (currentIndex > 0) {
      return siblings[currentIndex - 1]
    }
  }

  return null
}

const incompleteTaxonomy = concept => {
  return (
    !concept ||
    !concept.children ||
    concept.children.some(child => !child.children) ||
    !concept.parent
  )
}

export { getNextSibling, getPrevSibling, incompleteTaxonomy, NAME_TYPES }
