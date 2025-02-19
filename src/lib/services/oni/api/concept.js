import { oniGet, oniPut } from './util'

const fetchChildren = async (config, conceptName) =>
  oniGet(config, ['concept', 'children', conceptName])

const fetchConcept = async (config, conceptName) => oniGet(config, ['concept', conceptName])

const fetchParent = async (config, conceptName) =>
  oniGet(config, ['concept', 'parent', conceptName])

const fetchNames = async (config, conceptName) => oniGet(config, ['raw', 'concept', conceptName])

const updateConceptAuthor = async (config, conceptName, updates) =>
  oniPut(config, ['names', conceptName], updates)

const updateConceptName = async (config, conceptName, updates) =>
  oniPut(config, ['names', conceptName], { newName: updates.name })

const updateConceptParent = async (config, conceptName, updates) =>
  oniPut(config, ['concept', conceptName], { parentName: updates.parent })

const updateConceptRank = async (config, conceptName, updates) =>
  oniPut(config, ['concept', conceptName], updates)

export {
  fetchChildren,
  fetchConcept,
  fetchNames,
  fetchParent,
  updateConceptAuthor,
  updateConceptName,
  updateConceptParent,
  updateConceptRank,
}
