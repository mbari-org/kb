const addChild = (state, update) => {
  return {
    ...state,
    children: [...state.children, update.child],
  }
}

const resetChildren = (state, update) => {
  const { index: resetIndex } = update

  if (1 < state.children.length && resetIndex !== undefined) {
    const child = update.children[resetIndex]
    return {
      ...state,
      children: state.children.map(item => (item.name === child.name ? child : item)),
    }
  }
  return {
    ...state,
    children: update.children,
  }
}

export { addChild, resetChildren }
