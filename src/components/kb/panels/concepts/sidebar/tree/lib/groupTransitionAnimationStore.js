let animatingId = null
const listeners = new Set()

const setGroupTransitionAnimatingId = id => {
  animatingId = id
  listeners.forEach(listener => listener())
}

const subscribeGroupTransitionAnimating = listener => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const isGroupTransitionAnimating = itemId => animatingId === itemId

export {
  isGroupTransitionAnimating,
  setGroupTransitionAnimatingId,
  subscribeGroupTransitionAnimating,
}
