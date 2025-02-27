const structureState = concept => {
  return {
    name: concept.name,
    parentName: concept.parent?.name,
  }
}

export { structureState }
