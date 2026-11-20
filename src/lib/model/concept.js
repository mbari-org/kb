import { getConcept as apiConcept, getConceptChildren, getConceptPhylogenyDown } from '@/lib/api/concept'
import { CONCEPT } from '@/lib/constants'
import { pick } from '@/lib/utils'

const { FIELD } = CONCEPT

const getChildrenInfo = async (apiFns, conceptName) => {
  const children = await apiFns.apiPayload(getConceptChildren, conceptName)
  return children.map(child => pick(child, [FIELD.ID, FIELD.NAME, FIELD.ALTERNATE_NAMES]))
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
  const phylogeny = await apiFns.apiPayload(getConceptPhylogenyDown, conceptName)

  const descendantNames = node =>
    (node.children || []).flatMap(child => [child.name, ...descendantNames(child)])

  return descendantNames(phylogeny)
}

const sortConceptChildren = children =>
  [...children].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

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
  getChildrenInfo,
  getConcept,
  getDescendantNames,
  getDescendantsInfo,
  getNextSibling,
  getPrevSibling,
  sortConceptChildren,
}

