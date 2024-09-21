const localStore = (key, json = true) => {
  const stringStore = {
    get: () => localStorage.getItem(key),
    set: value => localStorage.setItem(key, value),
    clear: () => localStorage.removeItem(key),
  }

  if (json) {
    return {
      get: () => JSON.parse(stringStore.get(key)),
      set: value => stringStore.set(JSON.stringify(value)),
      clear: () => localStorage.removeItem(key),
    }
  }
  return stringStore
}

export default localStore
