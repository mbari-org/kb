import { updateConceptFields } from "@/lib/services/oni/api/concept"
import { isEmpty, prune } from "@/lib/util"

const processChanges = async (concept, changes, taxonomy) => {
  const { author, rankLevel, name, media, rankName } = changes

  let updatedConcept = { ...concept }

  updatedConcept = await submitChange(
    updatedConcept,
    { author, rankLevel, rankName },
    updateFields,
    taxonomy.config
  )

  updatedConcept = await submitChange(
    updatedConcept,
    { name },
    updateName,
    taxonomy.config
  )

  updatedConcept = await submitChange(
    updatedConcept,
    { media },
    updateMedia,
    taxonomy.config
  )

  return updatedConcept
}

const updateFields = async (concept, updates, config) => {
  const updatedConcept = await updateConceptFields(
    concept.name,
    updates,
    config
  )
  console.log(`Updating fields for concept ${concept.name} with:`, updates)
  return updatedConcept
}

const updateMedia = async (concept, media, _config) => {
  console.log(`Updating media for concept ${concept.name} with:`, media)
  return concept
}

const updateName = async (concept, name, _config) => {
  console.log(`Updating name for concept ${concept.name} with:`, name)
  return concept
}

const submitChange = async (concept, changes, update, config) => {
  const changed = prune(changes)
  if (isEmpty(changed)) return concept

  return update(concept, changed, config)
}

export { processChanges }
