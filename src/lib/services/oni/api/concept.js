import { oniDelete, oniGet, oniPost, oniPut } from './util'

const createConcept = async (config, updates) => oniPost(config, ['concept'], updates)

const deleteConcept = async (config, conceptName) => oniDelete(config, ['concept', conceptName])

const fetchChildren = async (config, conceptName) =>
  oniGet(config, ['concept', 'children', conceptName])

const fetchConcept = async (config, conceptName) => oniGet(config, ['concept', conceptName])

const fetchParent = async (config, conceptName) =>
  oniGet(config, ['concept', 'parent', conceptName])

const fetchNames = async (config, conceptName) => oniGet(config, ['raw', 'names', conceptName])

const updateConceptAuthor = async (config, [conceptName, updates]) =>
  oniPut(config, ['names', conceptName], updates)

const updateConceptName = async (config, [conceptName, updates]) =>
  oniPut(config, ['names', conceptName], { newName: updates.name })

const updateConceptParent = async (config, [conceptName, updates]) =>
  oniPut(config, ['concept', conceptName], { parentName: updates.parent })

const updateConceptRank = async (config, [conceptName, updates]) =>
  oniPut(config, ['concept', conceptName], updates)

export {
  createConcept,
  deleteConcept,
  fetchChildren,
  fetchConcept,
  fetchNames,
  fetchParent,
  updateConceptAuthor,
  updateConceptName,
  updateConceptParent,
  updateConceptRank,
}
