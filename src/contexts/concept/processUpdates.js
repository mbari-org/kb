import { updateConceptFields } from "@/lib/services/oni/api/concept"
import { isEmpty, prune } from "@/lib/util"

const processUpdates = async (concept, updates, taxonomy) => {
  const { author, rankLevel, name, media, rankName } = updates

  let updatedConcept = { ...concept }

  updatedConcept = await submit(
    updateConceptFields,
    updatedConcept,
    { author, rankLevel, rankName },
    taxonomy.config
  )

  updatedConcept = await submit(
    updateName,
    updatedConcept,
    { name },
    taxonomy.config
  )

  updatedConcept = await submit(
    updateMedia,
    updatedConcept,
    { media },
    taxonomy.config
  )

  return updatedConcept
}

const updateMedia = async (concept, media, _config) => {
  console.log(`Updating media for concept ${concept.name} with:`, media)
  return { concept }
}

const updateName = async (concept, name, _config) => {
  console.log(`Updating name for concept ${concept.name} with:`, name)
  return { concept }
}

const submit = async (updateFn, concept, conceptUpdates, config) => {
  const updates = prune(conceptUpdates)
  if (isEmpty(updates)) return concept

  const { error, payload: updatedConcept } = await updateFn(
    concept.name,
    updates,
    config
  )
  return { error, updatedConcept }
}

export { processUpdates }
