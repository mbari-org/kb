const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const checkImageUrlExists = url => {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

const drop = (object, fields) => {
  return Object.keys(object).reduce((result, key) => {
    if (!fields.includes(key)) {
      result[key] = object[key]
    }
    return result
  }, {})
}

const deepDiff = (o1, o2) => {
  const diff = {}

  Object.keys(o1).forEach(key => {
    if (typeof o1[key] === 'object' && o1[key] !== null && !Array.isArray(o1[key])) {
      const nestedDiff = deepDiff(o1[key], o2[key])
      if (Object.keys(nestedDiff).length > 0) {
        diff[key] = nestedDiff
      }
    } else if (!isEqual(o1[key], o2[key])) {
      diff[key] = o1[key]
    }
  })

  return diff
}

const diff = (o1, o2) =>
  Object.keys(o1).reduce((result, key) => {
    if (!isEqual(o1[key], o2[key])) {
      result[key] = o1[key]
    }
    return result
  }, {})

const isDeepEqual = (obj1, obj2, depth = Infinity) => {
  if (
    depth === 0 ||
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return isEqual(obj1, obj2)
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (let key of keys1) {
    if (!keys2.includes(key)) return false

    if (typeof obj1[key] === 'object' && obj1[key] !== null) {
      if (!isDeepEqual(obj1[key], obj2[key], depth - 1)) return false
    } else if (!isEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

// quick comparison of simple, JSON serializable objects
const isJsonEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

const isElementInViewport = element => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

const isEmpty = object => {
  if (Array.isArray(object)) {
    return object.length === 0
  } else if (typeof object === 'object' && object !== null) {
    return Object.keys(object).length === 0
  }
  return true
}

const isEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (let key of keys1) {
    if (!keys2.includes(key) || obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}

const isRefEqual = (obj1, obj2, depth = Infinity) => {
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return obj1 === obj2
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (let key of keys1) {
    if (!keys2.includes(key)) return false

    if (depth > 0 && typeof obj1[key] === 'object' && obj1[key] !== null) {
      if (!isRefEqual(obj1[key], obj2[key], depth - 1)) return false
    } else {
      if (obj1[key] !== obj2[key]) return false
    }
  }

  return true
}

const isUrlValid = url => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const pick = (object, fields) => {
  return fields.reduce((result, field) => {
    if (Array.isArray(field)) {
      const [originalField, newField] = field
      if (Object.prototype.hasOwnProperty.call(object, originalField)) {
        result[newField] = object[originalField]
      }
    } else if (Object.prototype.hasOwnProperty.call(object, field)) {
      result[field] = object[field]
    }
    return result
  }, {})
}

const prettyFormat = object => {
  return Object.entries(object)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
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

const prunePick = (object, fields) => prune(pick(object, fields))

export {
  capitalize,
  checkImageUrlExists,
  deepDiff,
  diff,
  drop,
  isDeepEqual,
  isElementInViewport,
  isEmpty,
  isEqual,
  isJsonEqual,
  isRefEqual,
  isUrlValid,
  pick,
  prettyFormat,
  prune,
  prunePick,
}
