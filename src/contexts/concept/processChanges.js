import { updateConceptFields } from "@/lib/services/oni/api/concept"
import { isEmpty, prune } from "@/lib/util"

const processChanges = async (conceptName, changes, taxonomy) => {
  const { author, rankLevel, name, media, rankName } = changes

  submitChanged(
    conceptName,
    { author, rankLevel, rankName },
    taxonomy,
    updateConceptFields
  )
  submitChanged(conceptName, { name }, taxonomy, updateName)
  submitChanged(conceptName, { media }, taxonomy, updateMedia)

  console.log(`Updating concept ${conceptName} with changes:`, changes)
}

const updateMedia = async (conceptName, media) => {
  console.log(`Updating media for concept ${conceptName} with:`, media)
}

const updateName = async (conceptName, name) => {
  console.log(`Updating name for concept ${conceptName} with:`, name)
}

const submitChanged = (conceptName, changes, taxanomy, update) => {
  const changed = prune(changes)
  if (!isEmpty(changed)) {
    update(conceptName, changed, taxanomy.config)
  }
}

export { processChanges }
