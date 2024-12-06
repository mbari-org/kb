const filterUpdates = initialState => state => {
  const updates = {}
  Object.keys(state).forEach(key => {
    if (state[key] !== initialState[key]) {
      updates[key] = state[key]
    }
  })
  return updates
}

export { filterUpdates }
