import { oniGet, oniPut } from "./util"

const fetchChildren = async (config, conceptName) =>
  oniGet(config, ["concept", "children", conceptName])

const fetchConcept = async (config, conceptName) =>
  oniGet(config, ["concept", conceptName])

const fetchParent = async (config, conceptName) =>
  oniGet(config, ["concept", "parent", conceptName])

const updateConceptAuthor = async (config, conceptName, updates) =>
  oniPut(config, ["names", conceptName], updates)

const updateConceptName = async (config, conceptName, updates) =>
  oniPut(config, ["names", conceptName], updates)

const updateConceptRank = async (config, conceptName, updates) =>
  oniPut(config, ["concept", conceptName], updates)

export {
  fetchChildren,
  fetchConcept,
  fetchParent,
  updateConceptAuthor,
  updateConceptName,
  updateConceptRank,
}
