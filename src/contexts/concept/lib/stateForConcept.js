import { orderMedia } from "@/lib/kb/concept/media"

const stateForConcept = concept => {
  return {
    author: concept.author || "unknown",
    name: concept.name,
    media: orderMedia(concept.media),
    rankLevel: concept.rankLevel || "",
    rankName: concept.rankName || "",
  }
}

export { stateForConcept }
