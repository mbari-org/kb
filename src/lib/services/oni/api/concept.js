import { oniGet } from "./util/get"
import { oniPut } from "./util/put"

const fetchChildren = async (conceptName, config) =>
  oniGet(config, ["concept", "children", conceptName])

const fetchConcept = async (conceptName, config) =>
  oniGet(config, ["concept", conceptName])

const fetchParent = async (conceptName, config) =>
  oniGet(config, ["concept", "parent", conceptName])

const updateConceptFields = async (conceptName, updates, config) =>
  oniPut(config, ["concept", conceptName], updates)

export { fetchChildren, fetchConcept, fetchParent, updateConceptFields }
