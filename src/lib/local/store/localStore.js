const localStore = (key, json = true) => {
  const stringStore = {
    get: () => localStorage.getItem(key),
    remove: () => localStorage.removeItem(key),
    set: value => localStorage.setItem(key, value),
  }

  if (json) {
    return {
      get: () => {
        const value = stringStore.get(key)
        return value ? JSON.parse(value) : null
      },
      remove: () => localStorage.removeItem(key),
      set: value => stringStore.set(JSON.stringify(value)),
    }
  }
  return stringStore
}

export default localStore
