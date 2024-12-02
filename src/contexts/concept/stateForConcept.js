const stateForConcept = concept => {
  return {
    author: concept.author || "unknown",
    rankLevel: concept.rankLevel || "",
    name: concept.name,
    media: concept.media,
    rankName: concept.rankName || "",
  }
}

export { stateForConcept }
