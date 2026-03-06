import { PREFS } from '@/lib/constants/prefs.js'
import { createPreferencesPayload, parsePreferences } from '@/lib/model/preferences'
import { oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'
import { paramsQs } from '@/lib/services/params'
const userPrefsName = username => PREFS.USER.PREFIX + username
const appPrefsName = () => PREFS.APP.PREFIX

const prefsQs = (name, key) => paramsQs({ name, key })

const getPreferences = async (config, username, key) => {
  const response = key
    ? await oniGet({ config, path: ['prefs'], qs: prefsQs(userPrefsName(username), key) })
    : await oniGet({
        config,
        path: ['prefs', 'startswith'],
        qs: paramsQs({ prefix: userPrefsName(username) }),
      })
  return parsePreferences(response.payload)
}

const createPreferences = async (config, username, type, value) => {
  const payload = createPreferencesPayload(type, value)
  await oniPost({
    config,
    path: ['prefs'],
    data: { name: userPrefsName(username), key: payload.type, value: payload.value },
  })
}

const updatePreferences = async (config, username, type, value) => {
  const payload = createPreferencesPayload(type, value)
  await oniPut({
    config,
    path: ['prefs'],
    qs: prefsQs(userPrefsName(username), payload.type),
    data: { value: payload.value },
  })
}

const getAppPreference = async (config, key) => {
  const response = await oniGet({ config, path: ['prefs'], qs: prefsQs(appPrefsName(), key) })
  const [preference] = response.payload || []
  return preference ? preference.value : null
}

const createAppPreference = async (config, key, value) => {
  await oniPost({ config, path: ['prefs'], data: { name: appPrefsName(), key, value } })
}

const updateAppPreference = async (config, key, value) => {
  await oniPut({
    config,
    path: ['prefs'],
    qs: prefsQs(appPrefsName(), key),
    data: { value },
  })
}

export {
  createAppPreference,
  createPreferences,
  getAppPreference,
  getPreferences,
  updateAppPreference,
  updatePreferences,
}
