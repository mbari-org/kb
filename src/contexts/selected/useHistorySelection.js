import createHistoryState from '@/lib/local/state/historyState'
import { useCallback, useMemo, useState } from 'react'

const useHistorySelection = (defaultValue, onCurrentChange) => {
  const store = useMemo(() => createHistoryState(defaultValue), [defaultValue])

  const [current, setCurrent] = useState(() => ({
    value: store.current(),
    position: store.getPosition(),
    entries: store.getState(),
  }))

  const updateCurrent = useCallback(
    value => {
      const position = store.getPosition()
      const entries = store.getState()
      setCurrent(previous =>
        previous.value === value &&
        previous.position === position &&
        previous.entries.length === entries.length &&
        previous.entries.every((entry, index) => entry === entries[index])
          ? previous
          : { value, position, entries }
      )
      if (onCurrentChange) onCurrentChange(value)
    },
    [onCurrentChange, store]
  )

  return useMemo(
    () => ({
      ...store,

      current: () => current.value,

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
    }),
    [current, store, updateCurrent]
  )
}

export default useHistorySelection
