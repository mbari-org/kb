import localStore from './localStore'

// Trim the ending cycle of an array.
//   ['A','B','C','C'] -> ['A','B','C']
//   ['A', 'B', 'C', 'A', 'B', 'A', 'B'] -> ['A', 'B', 'C', 'A', 'B']
//   ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'] -> ['A', 'B', 'C', 'D']
const trimEndingCycle = array => {
  const n = array.length
  const maxLen = Math.floor(n / 2)

  const isMatch = len => array.slice(n - 2 * len, n - len).every((v, i) => v === array[n - len + i])

  const k = Array.from({ length: maxLen }, (_, i) => i + 1).reduce(
    (acc, len) => (isMatch(len) ? len : acc),
    0
  )

  return array.slice(0, n - k)
}

const historyStore = (store, maxSize, defaultEntry) => {
  const initStore = () => {
    store.set({ state: [defaultEntry], position: 0 })
  }

  if (!store.get()) {
    initStore()
  }

  return {
    back: () => {
      const { position, state } = store.get()
      const newPosition = position > 0 ? position - 1 : 0
      store.set({ state, position: newPosition })
      return state[newPosition]
    },

    backItems: () => {
      const { position, state } = store.get()
      return state.slice(0, position).reverse()
    },

    canGoBack: () => store.get().position > 0,

    canGoForward: () => {
      const { state, position } = store.get()
      return position < state.length - 1
    },

    clear: () => store.set({ state: [], position: -1 }),

    init: () => initStore(),

    current: () => {
      const { state, position } = store.get()
      return state[position]
    },

    forward: () => {
      const { position, state } = store.get()
      const newPosition = position < state.length - 1 ? position + 1 : position
      store.set({ state, position: newPosition })
      return state[newPosition]
    },

    forwardItems: () => {
      const { position, state } = store.get()
      return state.slice(position + 1)
    },

    getPosition: () => store.get().position,

    getState: () => store.get().state,

    goBack: delta => {
      const { position, state } = store.get()
      const newPosition = Math.max(0, position - delta)
      store.set({ state, position: newPosition })
      return state[newPosition]
    },

    goForward: delta => {
      const { position, state } = store.get()
      const newPosition = Math.min(state.length - 1, position + delta)
      store.set({ state, position: newPosition })
      return state[newPosition]
    },

    push: entry => {
      const { state, position } = store.get()

      // Remove forward history, add new entry, trim length
      const pushState = state.slice(0, position + 1)
      pushState.push(entry)
      if (pushState.length > maxSize) {
        pushState.shift()
      }

      const trimState = trimEndingCycle(pushState)

      store.set({ state: trimState, position: trimState.length - 1 })
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
