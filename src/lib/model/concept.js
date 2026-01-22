import { getConcept as apiConcept, getConceptChildren, getConceptDescendants } from '@/lib/api/concept'
import { CONCEPT } from '@/lib/constants'
import { pick } from '@/lib/utils'

const addedConcepts = (parent, updatesInfo) => {
  const { updatedValue } = updatesInfo
  return updatedValue(CONCEPT.FIELD.CHILDREN).map(child => ({
    ...child,
    aliases: [],
    alternateNames: [],
    media: [],
    parent,
    realizations: [],
    references: [],
  }))
}

const getChildrenInfo = async (apiFns, conceptName) => {
  const children = await apiFns.apiPayload(getConceptChildren, conceptName)
  return children.map(child => pick(child, ['id', 'name', 'alternateNames']))
}

const getConcept = async (apiFns, conceptName) =>
  apiFns.apiPayload(apiConcept, conceptName)

const getDescendantsInfo = async (apiFns, conceptName, conceptId, descendantsInfo = []) => {
  const children = await getChildrenInfo(apiFns, conceptName)

  for (const child of children) {
    descendantsInfo.push({ ...child, parentId: conceptId })
    await getDescendantsInfo(apiFns, child.name, child.id, descendantsInfo)
  }

  return descendantsInfo
}

const getDescendantNames = async (apiFns, conceptName) => {
  const phylogeny = await apiFns.apiPayload(getConceptDescendants, conceptName)

  const names = []
  const collectNames = node => {
    names.push(node.name)
    if (node.children) {
      for (const child of node.children) {
        collectNames(child)
      }
    }
  }

  collectNames(phylogeny)
  return names
}

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

export {
  addedConcepts,
  getChildrenInfo,
  getConcept,
  getDescendantNames,
  getDescendantsInfo,
  getNextSibling,
  getPrevSibling,
}
