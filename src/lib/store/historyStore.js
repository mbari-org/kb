import localStore from './localStore'

const historyStore = (name, maxSize, defaultEntry) => {
  const store = localStore(name)

  // Initialize store with default entry if empty
  const history = store.get()
  if (!history || !history.state || !Array.isArray(history.state) || history.state.length === 0) {
    store.set({ state: [defaultEntry], position: 0 })
  }

  const getCurrent = () => {
    const { state, position } = getData()
    return state[position]
  }

  const getData = () => {
    const history = store.get()
    if (!history || !history.state || !Array.isArray(history.state) || history.state.length === 0) {
      const initialData = { state: [defaultEntry], position: 0 }
      store.set(initialData)
      return initialData
    }
    return history
  }

  const getHistory = () => getData().state
  const getPosition = () => getData().position

  return {
    push: entry => {
      const history = getData()
      const { state, position } = history

      // Remove forward history
      const newState = state.slice(0, position + 1)

      // Add new entry
      newState.push(entry)

      // Trim history if it exceeds maxSize
      if (newState.length > maxSize) {
        newState.shift()
      }

      store.set({ state: newState, position: newState.length - 1 })
    },

    get: () => getHistory(),

    current: () => getCurrent(),

    back: () => {
      const { position } = getData()
      if (position > 0) {
        store.set({ ...getData(), position: position - 1 })
      }
      return getCurrent()
    },

    forward: () => {
      const { state, position } = getData()
      if (position < state.length - 1) {
        store.set({ ...getData(), position: position + 1 })
      }
      return getCurrent()
    },

    canGoBack: () => getPosition() > 0,

    canGoForward: () => {
      const { state, position } = getData()
      return position < state.length - 1
    },

    clear: () => {
      store.set({ state: [defaultEntry], position: 0 })
    },
  }
}

export default historyStore
