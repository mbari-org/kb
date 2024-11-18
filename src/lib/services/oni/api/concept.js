import { oniGet } from "./get"
// import { oniPath } from "./resourcePath"

import authStore from "@/lib/store/auth"

const fetchChildren = async (conceptName, taxonomy) =>
  oniGet(taxonomy.config, ["concept", "children", conceptName])

const fetchConcept = async (conceptName, taxonomy) =>
  oniGet(taxonomy.config, ["concept", conceptName])

const fetchParent = async (conceptName, taxonomy) =>
  oniGet(taxonomy.config, ["concept", "parent", conceptName])

const updateConcept = async (conceptName, conceptData, taxonomy) => {
  const { url } = taxonomy.config.getServiceUrl("oni")
  const path = ["concept", conceptName]
  const resourcePath = path.map(piece => encodeURIComponent(piece)).join("/")
  const resource = `${url}/${resourcePath}`

  const { token } = authStore.get()

  const params = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(conceptData),
  }

  const response = await fetch(resource, params)

  if (!response.ok) {
    throw new Error(`Failed to update concept: ${response.statusText}`)
  }

  return response.json()
}

export { fetchChildren, fetchConcept, fetchParent, updateConcept }
