import { COMMON } from '@/text'

const after = (ms, fn) => new Promise(resolve => setTimeout(resolve, ms)).then(fn)

const capitalize = string => {
  const lower = string.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

const drop = (from, excludeFields) => {
  if (Array.isArray(from)) return dropElements(from, excludeFields)
  if (typeof from === 'object') return dropFields(from, excludeFields)
  throw new Error(`drop expects either an array or object, but got: ${from}`)
}

const dropElements = (array, excludeElements) => {
  return array.filter(element => !excludeElements.includes(element))
}

const dropFields = (object, excludeFields) => {
  return Object.keys(object).reduce((result, key) => {
    if (!excludeFields.includes(key)) {
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

const filterObject = (obj, predicate) => {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => predicate(key, value)))
}

const conceptNameForFilename = str =>
  (str || COMMON.UTILS.FILENAME.DEFAULT)
    .replace(/\s+/g, COMMON.UTILS.FILENAME.SEPARATOR)

const hasTrue = arg => {
  if (typeof arg === 'boolean') return arg
  const values = Array.isArray(arg) ? arg : Object.values(arg)
  return values.some(value => value === true || value === 'true')
}

const humanTimestamp = timestamp => {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  if (isNaN(date.getTime())) {
    return COMMON.UTILS.TIMESTAMP.INVALID_MESSAGE.replace('{value}', timestamp)
  }

  const month = date.toLocaleString('default', { month: 'short' })
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${month} ${day} ${year} ${hours}:${minutes}`
}

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

const isJsonEqual = (obj1, obj2) =>
  obj1 == null || obj2 == null ? false : JSON.stringify(obj1) === JSON.stringify(obj2)

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

const pluralCount = (count, word) => {
  return `${count} ${word}${count > 1 ? 's' : ''}`
}

const prettyFormat = object => {
  return Object.entries(object)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}

const prune = obj => {
  const pruned = { ...obj }
  Object.keys(pruned).forEach(key => {
    if (!obj[key]) {
      delete pruned[key]
    }
  })
  return pruned
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export {
  after,
  capitalize,
  conceptNameForFilename,
  deepDiff,
  diff,
  drop,
  filterObject,
  hasTrue,
  humanTimestamp,
  isDeepEqual,
  isElementInViewport,
  isEmpty,
  isEqual,
  isJsonEqual,
  isRefEqual,
  isUrlValid,
  pick,
  pluralCount,
  prettyFormat,
  prune,
  sleep,
}

