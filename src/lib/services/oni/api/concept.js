import { oniFetch } from "./fetch"

const fetchChildren = async (taxonomy, conceptName) =>
  oniFetch(taxonomy.config, ["concept", "children", conceptName])

const fetchConcept = async (taxonomy, conceptName) =>
  oniFetch(taxonomy.config, ["concept", conceptName])

const fetchParent = async (taxonomy, conceptName) =>
  oniFetch(taxonomy.config, ["concept", "parent", conceptName])

export { fetchChildren, fetchConcept, fetchParent }
