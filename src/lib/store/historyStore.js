import localStore from './localStore'

const historyStore = (store, maxSize, defaultEntry) => {
  const initStore = () => {
    store.set({ state: [defaultEntry], position: 0 })
  }

  if (!store.get()) {
    initStore()
  }

  return {
    back: () => {
      const history = store.get()
      const { position } = history
      if (position > 0) {
        store.set({ ...history, position: position - 1 })
      }
      return history.state[history.position]
    },

    canGoBack: () => store.get().position > 0,

    canGoForward: () => {
      const { state, position } = store.get()
      return position < state.length - 1
    },

    clear: () => initStore(),

    current: () => {
      const { state, position } = store.get()
      return state[position]
    },

    forward: () => {
      const history = store.get()
      const { position } = history
      if (position < history.state.length - 1) {
        store.set({ ...history, position: position + 1 })
      }
      return history.state[history.position]
    },

    getPosition: () => store.get().position,

    getState: () => store.get().state,

    push: entry => {
      const { state, position } = store.get()

      // Remove forward history
      const newState = state.slice(0, position + 1)

      // Add new entry
      newState.push(entry)

      // Trim length
      if (newState.length > maxSize) {
        newState.shift()
      }

      store.set({ state: newState, position: newState.length - 1 })
    },

    remove: () => store.remove(),
  }
}

const createHistoryStore = (name, maxSize, defaultEntry) => {
  const store = localStore(name)
  return historyStore(store, maxSize, defaultEntry)
}

const getHistoryStore = name => localStore(name)

export { createHistoryStore, getHistoryStore }
