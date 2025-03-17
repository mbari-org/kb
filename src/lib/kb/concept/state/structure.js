const structureState = concept => {
  return {
    name: concept.name,
    parentName: concept.parent?.name,
  }
}

const changeName = (state, update) => {
  const { field, value } = update
  return {
    ...state,
    [field]: value,
  }
}

const changeParent = (state, update) => {
  return {
    ...state,
    parentName: update.parentName,
  }
}

export { changeName, changeParent, structureState }
