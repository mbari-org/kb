import { oniGet } from "./util/get"

import { oniPut } from "./util/put"

const fetchChildren = async (conceptName, taxonomy) =>
  oniGet(taxonomy.config, ["concept", "children", conceptName])

const fetchConcept = async (conceptName, taxonomy) =>
  oniGet(taxonomy.config, ["concept", conceptName])

const fetchParent = async (conceptName, taxonomy) =>
  oniGet(taxonomy.config, ["concept", "parent", conceptName])

const updateConcept = async (conceptName, conceptData, taxonomy) =>
  oniPut(taxonomy.config, ["concept", conceptName], conceptData)

export { fetchChildren, fetchConcept, fetchParent, updateConcept }
