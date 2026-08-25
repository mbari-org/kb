import { getMedia } from '@/lib/api/media'
import { getConceptLinkRealizations } from '@/lib/api/realizations'
import { annosaurusGet } from '@/lib/services/annosaurus/methods'
import { oniGet, oniUserDelete, oniUserPost, oniUserPut } from '@/lib/services/oni/methods'

// The server caches concepts, so we don't "trust" the media and realizations arrays in the fetched concept object,
// instead we explicitly fetch media and realizations.
const normalizeConcept = async (apiFns, concept) => {
  const [freshMedia, freshRealizations] = await Promise.all([
    apiFns.apiPayload(getMedia, concept.name),
    apiFns.apiPayload(getConceptLinkRealizations, concept.name),
  ])

  concept.media = freshMedia
  concept.realizations = freshRealizations

  if (concept.linkRealizations) {
    delete concept.linkRealizations
  }

  return concept
}

const createConcept = async (config, updates) => oniUserPost({ config, path: ['concept'], data: updates })

const deleteConcept = async (config, conceptName) => oniUserDelete({ config, path: ['concept', conceptName] })

const getConcept = async (config, conceptName) => oniGet({ config, path: ['concept', conceptName] })

const getConceptAnnotations = async (config, conceptName) =>
  annosaurusGet({ config, path: ['fast', 'concept', conceptName] })

const getConceptChildren = async (config, conceptName) => oniGet({ config, path: ['concept', 'children', conceptName] })

const getConceptBasic = async (config, conceptName) => oniGet({ config, path: ['phylogeny', 'basic', conceptName] })

const getConceptDescendants = async (config, conceptName) =>
  oniGet({ config, path: ['phylogeny', 'down', conceptName] })

const getConceptParent = async (config, conceptName) => oniGet({ config, path: ['concept', 'parent', conceptName] })

const getConceptPath = async (config, conceptName) => oniGet({ config, path: ['phylogeny', 'up', conceptName] })

const getConceptNames = async (config, conceptName) => oniGet({ config, path: ['raw', 'names', conceptName] })

const getConceptTaxa = async (config, conceptName) => oniGet({ config, path: ['phylogeny', 'taxa', conceptName] })

const updateConceptAuthor = async (config, [conceptName, updates]) =>
  oniUserPut({ config, path: ['names', conceptName], data: updates })

const updateConceptName = async (config, [conceptName, updates]) =>
  oniUserPut({ config, path: ['names', conceptName], data: { newName: updates.name } })

const updateConceptParent = async (config, [conceptName, updates]) =>
  oniUserPut({ config, path: ['concept', conceptName], data: updates })

const updateConceptRank = async (config, [conceptName, updates]) =>
  oniUserPut({ config, path: ['concept', conceptName], data: updates })

export {
  createConcept,
  deleteConcept,
  getConcept,
  getConceptAnnotations,
  getConceptBasic,
  getConceptChildren,
  getConceptDescendants,
  getConceptNames,
  getConceptParent,
  getConceptPath,
  getConceptTaxa,
  normalizeConcept,
  updateConceptAuthor,
  updateConceptName,
  updateConceptParent,
  updateConceptRank,
}
