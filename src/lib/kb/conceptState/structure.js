const structureState = concept => {
  return {
    children: [],
    name: concept.name,
    parent: concept.parent,
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
    ...update,
  }
}

const resetAddChild = (state, update) => {
  const { child } = update
  return {
    ...state,
    children: state.children.map(item => (item.name === child.name ? child : item)),
  }
}

const resetAddChildren = state => {
  return {
    ...state,
    children: [],
  }
}

const resetChangeName = (state, update) => {
  const { field, value } = update
  return {
    ...state,
    [field]: value,
  }
}

const resetChangeParent = (state, update) => {
  const { field, value } = update
  return {
    ...state,
    [field]: value,
  }
}

export {
  addChild,
  changeName,
  changeParent,
  resetAddChild,
  resetAddChildren,
  resetChangeName,
  resetChangeParent,
  structureState,
}
