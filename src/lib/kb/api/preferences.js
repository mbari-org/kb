import { PREFS } from '@/lib/constants/constants'
import { createPreferencesPayload, parsePreferences } from '@/lib/kb/model/preferences'
import { oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'
import { paramsQs } from '@/lib/services/params'

const prefsName = username => PREFS.PREFIX + username

const prefsQs = (username, key) => paramsQs({ name: prefsName(username), key })

const getPreferences = async (config, username, key) => {
  const response = key
    ? await oniGet({ config, path: ['prefs'], qs: prefsQs(username, key) })
    : await oniGet({ config, path: ['prefs', 'startswith'], qs: paramsQs({ prefix: prefsName(username) }) })
  return parsePreferences(response.payload)
}

const createPreferences = async (config, username, type, value) => {
  const payload = createPreferencesPayload(type, value)
  await oniPost({ config, path: ['prefs'], data: { name: prefsName(username), key: payload.type, value: payload.value } })
}

const updatePreferences = async (config, username, type, value) => {
  const payload = createPreferencesPayload(type, value)
  await oniPut({ config, path: ['prefs'], qs: prefsQs(username, payload.type), data: { value: payload.value } })
}

export { createPreferences, getPreferences, updatePreferences }
