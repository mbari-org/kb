const localStore = (key, json = true) => {
  const stringStore = {
    get: () => localStorage.getItem(key),
    set: value => localStorage.setItem(key, value),
    clear: () => localStorage.removeItem(key),
  }

  if (json) {
    return {
      get: () => {
        const value = stringStore.get(key)
        return value ? JSON.parse(value) : null
      },
      set: value => stringStore.set(JSON.stringify(value)),
      clear: () => localStorage.removeItem(key),
    }
  }
  return stringStore
}

export default localStore
