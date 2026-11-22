import { getMedia, patchPrimaryImageFlag } from '@/lib/api/media'
import { annosaurusGet } from '@/lib/services/annosaurus/methods'
import { oniGet, oniUserDelete, oniUserPost, oniUserPut } from '@/lib/services/oni/methods'

const createConcept = async (config, updates) => oniUserPost({ config, path: ['concept'], data: updates })

const deleteConceptById = async (config, conceptId) => oniUserDelete({ config, path: ['concept', 'id', conceptId] })

const deleteConceptNameById = async (config, nameId) => oniUserDelete({ config, path: ['names', 'id', nameId] })

const getConceptAnnotations = async (config, conceptName) =>
  annosaurusGet({ config, path: ['fast', 'concept', conceptName] })

const getConceptById = async (config, conceptId) => oniGet({ config, path: ['concept', 'id', conceptId] })

const getConceptByName = async (config, conceptName) => {
  const concept = await oniGet({ config, path: ['concept', conceptName] })
  return concept
}

const getConceptChildren = async (config, conceptName) => oniGet({ config, path: ['concept', 'children', conceptName] })

const getConceptNamesById = async (config, nameId) => oniGet({ config, path: ['names', 'id', nameId] })

const getConceptNames = async (config, conceptName) => oniGet({ config, path: ['raw', 'names', conceptName] })

const getConceptParent = async (config, conceptName) => oniGet({ config, path: ['concept', 'parent', conceptName] })

const getConceptPhylogenyDown = async (config, conceptName) =>
  oniGet({ config, path: ['phylogeny', 'down', conceptName] })

const getConceptPhylogenyUp = async (config, conceptName) => oniGet({ config, path: ['phylogeny', 'up', conceptName] })

const getConceptTaxa = async (config, conceptName) => oniGet({ config, path: ['phylogeny', 'taxa', conceptName] })

const normalizeConcept = async (apiFns, concept) => {
  concept.media = await apiFns.apiPayload(getMedia, concept.name)
  await patchPrimaryImageFlag(apiFns, concept)

  if (concept.linkRealizations) {
    delete concept.linkRealizations
  }

  return concept
}

const updateConceptById = async (config, [conceptId, updates]) =>
  oniUserPut({ config, path: ['concept', 'id', conceptId], data: updates })

const updateConceptNameById = async (config, [nameId, updates]) =>
  oniUserPut({ config, path: ['names', 'id', nameId], data: updates })

export {
  createConcept,
  deleteConceptById,
  deleteConceptNameById,
  getConceptAnnotations,
  getConceptById,
  getConceptByName,
  getConceptChildren,
  getConceptNamesById,
  getConceptNames,
  getConceptParent,
  getConceptPhylogenyDown,
  getConceptPhylogenyUp,
  getConceptTaxa,
  normalizeConcept,
  updateConceptById,
  updateConceptNameById,
}
