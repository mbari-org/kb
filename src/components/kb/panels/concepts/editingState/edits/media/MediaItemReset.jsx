import { use } from "react"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"
import Reset from "../Reset"

const MediaItemReset = ({ mediaIndex }) => {
  const { editingState, modifyConcept } = use(ConceptContext)

  const onClick = () => {
    // CxTBD Check if this is the only media edit, and if so, do RESET_MEDIA
    const count = editingState.media.filter(
      item => item.action !== CONCEPT.NONE
    ).length
    count === 1
      ? modifyConcept({ type: CONCEPT.RESET_MEDIA })
      : modifyConcept({
          type: CONCEPT.RESET_MEDIA_ITEM,
          update: { mediaIndex },
        })
  }

  return <Reset onClick={onClick} />
}

export default MediaItemReset
