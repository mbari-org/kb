const debounce = (func, delay) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, delay)
  }
}

const isElementInViewport = element => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

const isEmpty = object => {
  if (Array.isArray(object)) {
    return object.length === 0
  } else if (typeof object === "object" && object !== null) {
    return Object.keys(object).length === 0
  }
  return true
}

const prune = obj => {
  const pruned = { ...obj }
  Object.keys(pruned).forEach(key => {
    if (obj[key] === undefined) {
      delete pruned[key]
    }
  })
  return pruned
}

export { debounce, isElementInViewport, isEmpty, prune }
