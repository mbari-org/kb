// This code employs a custom serialization strategy to reduce the size of user preferences. All
// serialization processing is done on the client side, and the in-memory representations are
// deserialized for debugging purposes. It also trims the preferences values to ensure they are
// within the maximum length of a string in the database.

import LZString from 'lz-string'

const MAX_PREFERENCE_LENGTH = 255

const PREF_TYPES = {
  CONCEPTS: 'concepts',
  PANELS: 'panels',
  SETTINGS: 'settings',
}

const HISTORY_TYPE_CODING = {
  approved: 'a',
  concept: 'c',
  pending: 'p',
}

// Helper functions to get code from type or type from code
const getHistoryTypeCode = type => HISTORY_TYPE_CODING[type] || 'p'
const getHistoryTypeFromCode = code => {
  const entry = Object.entries(HISTORY_TYPE_CODING).find(([, value]) => value === code)
  return entry ? entry[0] : 'pending'
}

const isValidPreferenceType = type => Object.values(PREF_TYPES).includes(type)

const toArray = (type, value) => {
  switch (type) {
    case PREF_TYPES.CONCEPTS:
    case PREF_TYPES.PANELS:
      // Array format: [state, position]
      //   state: array of concept/panel names
      //   position: current index in the state array
      return [value.state, value.position]

    case PREF_TYPES.SETTINGS: {
      // Array format: [historyTypeCode, referencesByConcept, templatesByAvailable, templatesFilters]
      //   historyTypeCode: single char ('a'=approved | 'c'=concept | 'p'=pending)
      //   referencesByConcept: 0 or 1 (false or true)
      //   templatesByAvailable: 0 or 1 (false or true)
      //   templatesFilters: array [concept, toConcept, linkName, linkValue] (empty string "" for null values)
      const filters = value.templates?.filters || {}
      const filtersArray = [
        filters.concept || '',
        filters.toConcept || '',
        filters.linkName || '',
        filters.linkValue || '',
      ]
      return [
        getHistoryTypeCode(value.history?.type),
        value.references?.byConcept ? 1 : 0,
        value.templates?.byAvailable ? 1 : 0,
        filtersArray,
      ]
    }

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

    case PREF_TYPES.SETTINGS: {
      // Array format: [historyTypeCode, referencesByConcept, templatesByAvailable, templatesFilters]
      const filtersArray = arr[3] || []
      const filters = {}
      if (filtersArray[0]) filters.concept = filtersArray[0]
      if (filtersArray[1]) filters.toConcept = filtersArray[1]
      if (filtersArray[2]) filters.linkName = filtersArray[2]
      if (filtersArray[3]) filters.linkValue = filtersArray[3]
      return {
        history: { type: getHistoryTypeFromCode(arr[0]) },
        references: { byConcept: arr[1] === 1 },
        templates: {
          byAvailable: arr[2] === 1,
          filters,
        },
      }
    }

    default:
      throw new Error(`Unknown preference type: ${type}`)
  }
}

const trimHistoryPreference = (type, value) => {
  if (type !== PREF_TYPES.CONCEPTS && type !== PREF_TYPES.PANELS) {
    return value
  }

  let trimmedValue = { ...value, state: [...value.state] }
  let serialized = serializeWithoutTrim(type, trimmedValue)

  while (serialized.length > MAX_PREFERENCE_LENGTH && trimmedValue.state.length > 1) {
    trimmedValue.state.shift()
    if (trimmedValue.position > 0) {
      trimmedValue.position--
    }
    serialized = serializeWithoutTrim(type, trimmedValue)
  }

  if (serialized.length > MAX_PREFERENCE_LENGTH) {
    throw new Error(`Preference value exceeds ${MAX_PREFERENCE_LENGTH} characters even after trimming`)
  }

  return trimmedValue
}

const serializeWithoutTrim = (type, value) => {
  const arr = toArray(type, value)
  const json = JSON.stringify(arr)
  return LZString.compressToBase64(json)
}

const serializePreferences = (type, value) => {
  if (value === undefined || value === null) {
    throw new Error('Cannot serialize undefined or null preferences value')
  }
  const trimmedValue = trimHistoryPreference(type, value)
  return serializeWithoutTrim(type, trimmedValue)
}

const deserializePreferences = (type, value) => {
  try {
    const json = LZString.decompressFromBase64(value)
    if (!json) {
      throw new Error('Failed to decompress value')
    }
    const arr = JSON.parse(json)
    return fromArray(type, arr)
  } catch (error) {
    throw new Error(`Failed to deserialize preferences value: ${error.message}`)
  }
}

const createPreferencesPayload = (type, value) => {
  if (!isValidPreferenceType(type)) {
    throw new Error(`Invalid preferences type: ${type}`)
  }
  return {
    type,
    value: serializePreferences(type, value),
  }
}

const parsePreferences = preferences => {
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

export {
  createPreferencesPayload,
  parsePreferences,
}
