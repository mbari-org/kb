const applyName = (concept, tracker) => {
  if (tracker.update?.value) {
    concept.name = tracker.update.value
  }
}

export default applyName
