import { oniFetchJson } from "./fetch"

const fetchChildren = async (conceptName, taxonomy) =>
  oniFetchJson(taxonomy.config, ["concept", "children", conceptName])

const fetchConcept = async (conceptName, taxonomy) =>
  oniFetchJson(taxonomy.config, ["concept", conceptName])

const fetchParent = async (conceptName, taxonomy) =>
  oniFetchJson(taxonomy.config, ["concept", "parent", conceptName])

export { fetchChildren, fetchConcept, fetchParent }
