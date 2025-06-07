import { useMemo, useState } from 'react'

/**
 * A generic hook for managing history-based selection state
 * @param {Function} createStore - Function to create the store instance
 * @param {any} initialValue - Initial value for the store
 * @returns {Object} History selection interface
 */
const useHistorySelect = (createStore, initialValue) => {
  const store = useMemo(() => createStore(initialValue), [createStore, initialValue])
  const [current, setCurrent] = useState(store.current())

  return {
    ...store,

    back: () => {
      const result = store.back()
      setCurrent(store.current())
      return result
    },

    current: () => current,

    forward: () => {
      const result = store.forward()
      setCurrent(store.current())
      return result
    },

    goBack: delta => {
      const result = store.goBack(delta)
      setCurrent(store.current())
      return result
    },

    goForward: delta => {
      const result = store.goForward(delta)
      setCurrent(store.current())
      return result
    },

    push: value => {
      store.push(value)
      setCurrent(value)
    },
  }
}

export default useHistorySelect
