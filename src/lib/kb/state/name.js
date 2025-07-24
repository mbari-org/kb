const nameState = concept => {
  return {
    name: {
      value: concept.name,
      extent: '',
    },
  }
}

const editName = (state, update) => {
  return {
    ...state,
    name: update,
  }
}

const resetName = (state, update) => {
  return {
    ...state,
    name: update.name,
  }
}

export { editName, nameState, resetName }
