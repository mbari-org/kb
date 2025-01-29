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

const dropFields = (object, fields) => {
  return Object.keys(object).reduce((result, key) => {
    if (!fields.includes(key)) {
      result[key] = object[key]
    }
    return result
  }, {})
}

const editsObject = (initialValues, editingValues) => {
  const edits = {}
  Object.keys(editingValues).forEach(field => {
    if (editingValues[field] !== initialValues[field]) {
      edits[field] = {
        initial: initialValues[field],
        pending: editingValues[field],
      }
    }
  })
  return edits
}

const editsDisplay = (initialValues, editingValues) => {
  const pendingEdits = editsObject(initialValues, editingValues)

  const fieldDisplay = field => (field !== "" ? field : '""')
  const pendingEditDisplay = field => {
    const { initial, pending } = pendingEdits[field]
    return `${fieldDisplay(initial)} --> ${fieldDisplay(pending)}`
  }

  return Object.keys(pendingEdits).reduce((acc, field) => {
    if (initialValues[field] !== editingValues[field]) {
      acc[field] = pendingEditDisplay(field)
      return acc
    }
  }, {})
}

const getFieldPendingHistory = (pendingHistory, field) => {
  const pendingField = capitalize(field)
  return pendingHistory
    ?.filter(pending => pending.field === pendingField)
    .sort(
      (a, b) => new Date(a.creationTimestamp) - new Date(b.creationTimestamp)
    )?.[0]
}

const hasPendingHistory = (pendingHistory, field) => {
  if (field) {
    return !isEmpty(getFieldPendingHistory(pendingHistory, field))
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

const pickFields = (object, fields) => {
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
    .join("\n")
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
  dropFields,
  editsDisplay,
  editsObject,
  getFieldPendingHistory,
  hasPendingHistory,
  isDeepEqual,
  isElementInViewport,
  isEmpty,
  pickFields,
  prettyFormat,
  prune,
}
