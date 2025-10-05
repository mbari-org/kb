// Constants representing the types of preferences supported by the KB UI
export const PREF_TYPES = {
  CONCEPTS: 'concepts',
  PANELS: 'panels',
  SETTINGS: 'settings',
}

const isValidPreferenceType = type => Object.values(PREF_TYPES).includes(type)

const toArray = (type, value) => {
  switch (type) {
    case PREF_TYPES.CONCEPTS:
    case PREF_TYPES.PANELS:
      // Array format: [state, position]
      // state: array of concept/panel names
      // position: current index in the state array
      return [value.state, value.position]

    case PREF_TYPES.SETTINGS:
      // Array format: [historyType, referencesByConcept, templatesAvailable, templatesFilters]
      // historyType: string ('approved' | 'concept' | 'pending')
      // referencesByConcept: boolean
      // templatesAvailable: boolean
      // templatesFilters: object with optional keys (concept, toConcept, linkName, linkValue)
      return [
        value.history?.type || 'pending',
        value.references?.byConcept || false,
        value.templates?.available || false,
        value.templates?.filters || {},
      ]

    default:
      throw new Error(`Unknown preference type: ${type}`)
  }
}

const fromArray = (type, arr) => {
  switch (type) {
    case PREF_TYPES.CONCEPTS:
    case PREF_TYPES.PANELS:
      // Array format: [state, position]
      return {
        state: arr[0],
        position: arr[1],
      }

    case PREF_TYPES.SETTINGS:
      // Array format: [historyType, referencesByConcept, templatesAvailable, templatesFilters]
      return {
        history: { type: arr[0] },
        references: { byConcept: arr[1] },
        templates: {
          available: arr[2],
          filters: arr[3],
        },
      }

    default:
      throw new Error(`Unknown preference type: ${type}`)
  }
}

export const serializePreferences = (type, value) => {
  if (value === undefined || value === null) {
    throw new Error('Cannot serialize undefined or null preferences value')
  }
  const arr = toArray(type, value)
  return JSON.stringify(arr)
}

export const deserializePreferences = (type, value) => {
  try {
    const arr = JSON.parse(value)
    return fromArray(type, arr)
  } catch (error) {
    throw new Error(`Failed to deserialize preferences value: ${error.message}`)
  }
}

export const createPreferencesPayload = (type, value) => {
  if (!isValidPreferenceType(type)) {
    throw new Error(`Invalid preferences type: ${type}`)
  }
  return {
    type,
    value: serializePreferences(type, value),
  }
}

export const parsePreferences = preferences => {
  const prefs = preferences.reduce((acc, preference) => {
    if (!preference || !preference.value || !preference.key) {
      throw new Error('Invalid preference response format')
    }
    const deserializedValue = deserializePreferences(preference.key, preference.value)
    acc[preference.key] = deserializedValue
    return acc
  }, {})

  return prefs
}
