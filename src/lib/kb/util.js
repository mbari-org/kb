const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

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

const hasPendingHistory = (pendingHistory, field) => {
  if (field) {
    const pendingField = capitalize(field)
    return pendingHistory.some(pending => pending.field === pendingField)
  }
  return !isEmpty(pendingHistory)
}

const isDeepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (let key of keys1) {
    if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
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

export {
  debounce,
  hasPendingHistory,
  isDeepEqual,
  isElementInViewport,
  isEmpty,
  prune,
}
