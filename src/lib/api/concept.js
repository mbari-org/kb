import { getMedia, patchPrimaryImageFlag } from '@/lib/api/media'
import { annosaurusGet } from '@/lib/services/annosaurus/methods'
import { oniGet, oniUserDelete, oniUserPost, oniUserPut } from '@/lib/services/oni/methods'

const normalizeConcept = async (apiFns, concept) => {
  concept.media = await apiFns.apiPayload(getMedia, concept.name)
  await patchPrimaryImageFlag(apiFns, concept)

  if (concept.linkRealizations) {
    delete concept.linkRealizations
  }

  return concept
}

const createConcept = async (config, updates) => oniUserPost({ config, path: ['concept'], data: updates })

const deleteConcept = async (config, conceptName) => oniUserDelete({ config, path: ['concept', conceptName] })

const getConcept = async (config, conceptName) => {
  const concept = await oniGet({ config, path: ['concept', conceptName] })
  return concept
}

const getConceptAnnotations = async (config, conceptName) =>
  annosaurusGet({ config, path: ['fast', 'concept', conceptName] })

const getConceptBasic = async (config, conceptName) => oniGet({ config, path: ['phylogeny', 'basic', conceptName] })

const getConceptChildren = async (config, conceptName) => oniGet({ config, path: ['concept', 'children', conceptName] })

const getConceptNames = async (config, conceptName) => oniGet({ config, path: ['raw', 'names', conceptName] })

const getConceptParent = async (config, conceptName) => oniGet({ config, path: ['concept', 'parent', conceptName] })

const getConceptPhylogenyDown = async (config, conceptName) =>
  oniGet({ config, path: ['phylogeny', 'down', conceptName] })

const getConceptPhylogenyUp = async (config, conceptName) => oniGet({ config, path: ['phylogeny', 'up', conceptName] })

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
  getConceptPhylogenyDown,
  getConceptNames,
  getConceptParent,
  getConceptPhylogenyUp,
  getConceptTaxa,
  normalizeConcept,
  updateConceptAuthor,
  updateConceptName,
  updateConceptParent,
  updateConceptRank,
}
