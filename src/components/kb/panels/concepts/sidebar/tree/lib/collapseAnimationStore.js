// Per-item subscription to the collapsing node id, so the flag reaches the one
//  animating ConceptTreeItem without re-rendering the whole tree (as slotProps would).
let animatingId = null
const listeners = new Set()

const setCollapseAnimatingId = id => {
  animatingId = id
  listeners.forEach(listener => listener())
}

const subscribeCollapseAnimating = listener => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const isCollapseAnimating = itemId => animatingId === itemId

export { isCollapseAnimating, setCollapseAnimatingId, subscribeCollapseAnimating }
