const structureState = concept => {
  return {
    children: [],
    name: concept.name,
    parentName: concept.parent?.name,
  }
}

const addChild = (state, update) => {
  return {
    ...state,
    children: [...state.children, update.child],
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

const resetChild = (state, update) => {
  const { child } = update
  return {
    ...state,
    children: state.children.map(item => (item.name === child.name ? child : item)),
  }
}

const resetChildren = state => {
  return {
    ...state,
    children: [],
  }
}

export { addChild, changeName, changeParent, resetChild, resetChildren, structureState }
