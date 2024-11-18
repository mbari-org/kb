import { oniGet } from "./fetch"

const fetchChildren = async (conceptName, taxonomy) =>
  oniGet(taxonomy.config, ["concept", "children", conceptName])

const fetchConcept = async (conceptName, taxonomy) =>
  oniGet(taxonomy.config, ["concept", conceptName])

const fetchParent = async (conceptName, taxonomy) =>
  oniGet(taxonomy.config, ["concept", "parent", conceptName])

const updateConcept = async (conceptName, conceptData, taxonomy) => {
  const response = await fetch(
    `${taxonomy.config.apiBaseUrl}/concept/${conceptName}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conceptData),
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to update concept: ${response.statusText}`)
  }

  return response.json()
}

export { fetchChildren, fetchConcept, fetchParent, updateConcept }
