import { oniGet } from "./util/get"

import { oniPut } from "./util/put"

const fetchChildren = async (conceptName, config) => {
  const path = ["concept", "children", conceptName]
  const { payload } = await oniGet(config, path)
  return payload
}

const fetchConcept = async (conceptName, config) => {
  const path = ["concept", conceptName]
  const { payload } = await oniGet(config, path)
  return payload
}

const fetchParent = async (conceptName, config) => {
  const path = ["concept", "parent", conceptName]
  const { payload } = await oniGet(config, path)
  return payload
}

const updateConceptFields = async (conceptName, changes, config) => {
  const path = ["concept", conceptName]
  const { payload } = await oniPut(config, path, changes)
  return payload
}

export { fetchChildren, fetchConcept, fetchParent, updateConceptFields }
