// Constants representing the types of preferences supported by the KB UI
export const PREF_TYPES = {
  CONCEPTS: 'concepts',
  PANELS: 'panels',
  SETTINGS: 'settings',
}

const isValidPreferenceType = type => Object.values(PREF_TYPES).includes(type)

export const serializePreferences = value => {
  if (value === undefined || value === null) {
    throw new Error('Cannot serialize undefined or null preferences value')
  }
  return JSON.stringify(value)
}

export const deserializePreferences = value => {
  try {
    return JSON.parse(value)
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
    value: serializePreferences(value),
  }
}

export const parsePreferences = preferences => {
  const prefs = preferences.reduce((acc, preference) => {
    if (!preference || !preference.value) {
      throw new Error('Invalid preference response format')
    }
    const deserializedValue = deserializePreferences(preference.value)
    acc[preference.key] = deserializedValue
    return acc
  }, {})

  return prefs
}