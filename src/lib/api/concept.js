import { annosaurusGet } from '@/lib/services/annosaurus/methods'
import { oniDelete, oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'

const createConcept = async (config, updates) => oniPost({ config, path: ['concept'], data: updates })

const deleteConcept = async (config, conceptName) => oniDelete({ config, path: ['concept', conceptName] })

const getConcept = async (config, conceptName) => oniGet({ config, path: ['concept', conceptName] })

const getConceptAnnotations = async (config, conceptName) =>
  annosaurusGet({ config, path: ['fast', 'concept', conceptName] })

const getConceptChildren = async (config, conceptName) =>
  oniGet({ config, path: ['concept', 'children', conceptName] })

const getConceptBasic = async (config, conceptName) =>
  oniGet({ config, path: ['phylogeny', 'basic', conceptName] })

const getConceptDescendants = async (config, conceptName) =>
  oniGet({ config, path: ['phylogeny', 'down', conceptName] })

const getConceptParent = async (config, conceptName) =>
  oniGet({ config, path: ['concept', 'parent', conceptName] })

const getConceptPath = async (config, conceptName) =>
  oniGet({ config, path: ['phylogeny', 'up', conceptName] })

const getConceptNames = async (config, conceptName) => oniGet({ config, path: ['raw', 'names', conceptName] })

const getConceptTaxa = async (config, conceptName) =>
  oniGet({ config, path: ['phylogeny', 'taxa', conceptName] })

const updateConceptAuthor = async (config, [conceptName, updates]) =>
  oniPut({ config, path: ['names', conceptName], data: updates })

const updateConceptName = async (config, [conceptName, updates]) =>
  oniPut({ config, path: ['names', conceptName], data: { newName: updates.name } })

const updateConceptParent = async (config, [conceptName, updates]) =>
  oniPut({ config, path: ['concept', conceptName], data: updates })

const updateConceptRank = async (config, [conceptName, updates]) =>
  oniPut({ config, path: ['concept', conceptName], data: updates })

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
  updateConceptAuthor,
  updateConceptName,
  updateConceptParent,
  updateConceptRank,
}

