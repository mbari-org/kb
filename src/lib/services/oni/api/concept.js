import { oniFetchJson } from "./fetch"

const fetchChildren = async (taxonomy, conceptName) =>
  oniFetchJson(taxonomy.config, ["concept", "children", conceptName])

const fetchConcept = async (taxonomy, conceptName) =>
  oniFetchJson(taxonomy.config, ["concept", conceptName])

const fetchParent = async (taxonomy, conceptName) =>
  oniFetchJson(taxonomy.config, ["concept", "parent", conceptName])

export { fetchChildren, fetchConcept, fetchParent }
