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

const createHistoryState = (maxSize, defaultEntry, initData) => {
  let data = initData || { state: [defaultEntry], position: 0 }

  return {
    back: () => {
      const { position, state } = data
      const newPosition = position > 0 ? position - 1 : 0
      data = { state, position: newPosition }
      return state[newPosition]
    },

    backItems: () => {
      const { position, state } = data
      return state.slice(0, position).reverse()
    },

    canGoBack: () => data.position > 0,

    canGoForward: () => {
      const { state, position } = data
      return position < state.length - 1
    },

    clear: () => {
      data = { state: [], position: -1 }
    },

    current: () => {
      const { state, position } = data
      return state[position]
    },

    forward: () => {
      const { position, state } = data
      const newPosition = position < state.length - 1 ? position + 1 : position
      data = { state, position: newPosition }
      return state[newPosition]
    },

    forwardItems: () => {
      const { position, state } = data
      return state.slice(position + 1)
    },

    getPosition: () => data.position,

    getState: () => data.state,

    goBack: delta => {
      const { position, state } = data
      const newPosition = Math.max(0, position - delta)
      data = { state, position: newPosition }
      return state[newPosition]
    },

    goForward: delta => {
      const { position, state } = data
      const newPosition = Math.min(state.length - 1, position + delta)
      data = { state, position: newPosition }
      return state[newPosition]
    },

    init: initData => {
      data = initData
    },

    push: entry => {
      const { state, position } = data

      const pushState = state.slice(0, position + 1)
      pushState.push(entry)
      if (pushState.length > maxSize) {
        pushState.shift()
      }

      const trimState = trimEndingCycle(pushState)

      data = { state: trimState, position: trimState.length - 1 }
    },

    remove: () => {
      data = { state: [defaultEntry], position: 0 }
    },
  }
}

export default createHistoryState