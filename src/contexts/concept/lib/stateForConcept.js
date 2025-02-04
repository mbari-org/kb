import { mediaState } from "@/lib/kb/concept/media"

const stateForConcept = concept => {
  return {
    author: concept.author || "unknown",
    children: concept.children.map(child => child.name),
    name: concept.name,
    media: mediaState(concept.media),
    parent: concept.parent.name,
    rankLevel: concept.rankLevel || "",
    rankName: concept.rankName || "",
  }
}

export { stateForConcept }
