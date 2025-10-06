import createHistoryState from '@/lib/state/historyState'
import { useCallback, useMemo, useState } from 'react'

const useHistorySelect = (defaultValue, onCurrentChange) => {
  const store = useMemo(() => createHistoryState(defaultValue), [defaultValue])

  const [current, setCurrent] = useState(() => store.current())

  const updateCurrent = useCallback(value => {
    setCurrent(value)
    if (onCurrentChange) onCurrentChange(value)
  }, [onCurrentChange])

  return useMemo(() => ({
    ...store,

    current: () => current,

    push: value => {
      store.push(value)
      updateCurrent(value)
    },

    back: () => {
      const result = store.back()
      updateCurrent(result)
      return result
    },

    forward: () => {
      const result = store.forward()
      updateCurrent(result)
      return result
    },

    goBack: delta => {
      const result = store.goBack(delta)
      updateCurrent(result)
      return result
    },

    goForward: delta => {
      const result = store.goForward(delta)
      updateCurrent(result)
      return result
    },

    clear: () => {
      store.clear()
      updateCurrent(null)
    },

    init: initData => {
      store.init(initData)
      updateCurrent(store.current())
    },

    getState: () => store.getState(),
    getPosition: () => store.getPosition(),
  }), [current, store, updateCurrent])
}

export default useHistorySelect