import { annosaurusGet } from '@/lib/services/annosaurus/methods'
import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const createConcept = async (config, updates) => oniPost(config, ['concept'], updates)

const deleteConcept = async (config, conceptName) => oniDelete(config, ['concept', conceptName])

const getConcept = async (config, conceptName) => oniGet(config, ['concept', conceptName])

const getConceptAnnotations = async (config, conceptName) =>
  annosaurusGet(config, ['fast', 'concept', conceptName])

const getConceptChildren = async (config, conceptName) =>
  oniGet(config, ['concept', 'children', conceptName])

const getConceptParent = async (config, conceptName) =>
  oniGet(config, ['concept', 'parent', conceptName])

const getConceptNames = async (config, conceptName) => oniGet(config, ['raw', 'names', conceptName])

const getConceptTaxa = async (config, conceptName) =>
  oniGet(config, ['phylogeny', 'taxa', conceptName])

const updateConceptAuthor = async (config, [conceptName, updates]) =>
  oniPut(config, ['names', conceptName], updates)

const updateConceptName = async (config, [conceptName, updates]) =>
  oniPut(config, ['names', conceptName], { newName: updates.name })

const updateConceptParent = async (config, [conceptName, updates]) =>
  oniPut(config, ['concept', conceptName], updates)

const updateConceptRank = async (config, [conceptName, updates]) =>
  oniPut(config, ['concept', conceptName], updates)

export {
  createConcept,
  deleteConcept,
  getConcept,
  getConceptAnnotations,
  getConceptChildren,
  getConceptNames,
  getConceptParent,
  getConceptTaxa,
  updateConceptAuthor,
  updateConceptName,
  updateConceptParent,
  updateConceptRank,
}
