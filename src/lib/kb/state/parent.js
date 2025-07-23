const parentState = concept => {
  const { parent } = concept
  return {
    parent: parent || '',
  }
}

const editParent = (state, update) => {
  const { value } = update
  return { ...state, parent: value }
}

const resetParent = (state, update) => {
  return { ...state, parent: update.parent }
}

export { editParent, parentState, resetParent }
