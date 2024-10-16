import { apiFetch } from "./fetch"

const fetchChildren = async (taxonomy, conceptName) =>
  apiFetch(taxonomy.config, ["concept", "children", conceptName])

const fetchConcept = async (taxonomy, conceptName) =>
  apiFetch(taxonomy.config, ["concept", conceptName])

const fetchNames = async config => {
  const { content } = await apiFetch(config, ["names"])
  return content
}

const fetchParent = async (taxonomy, conceptName) =>
  apiFetch(taxonomy.config, ["concept", "parent", conceptName])

const fetchRoot = async config => apiFetch(config, ["concept", "query", "root"])

export { fetchChildren, fetchConcept, fetchNames, fetchParent, fetchRoot }
