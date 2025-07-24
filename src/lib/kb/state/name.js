const nameState = concept => {
  const { name } = concept
  return {
    name: name || '',
  }
}

const editName = (state, update) => {
  const { value } = update
  return { ...state, name: value }
}

const resetName = (state, update) => {
  return { ...state, name: update.name }
}

export { editName, nameState, resetName }
