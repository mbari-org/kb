import { oniGet, oniPost, oniPut } from '@/lib/services/oni/methods'
import { paramsQs } from '@/lib/services/params'

const PREFS_NAME = 'kb-ui'

const prefsQs = username => paramsQs(({ name: PREFS_NAME, key: username }))

const getPreferences = async (config, username) =>
  oniGet({ config, path: ['prefs'], qs: prefsQs(username) })

const createPreferences = async (config, username, value) =>
  oniPost({ config, path: ['prefs'], qs: prefsQs(username), data: { value } })

const updatePreferences = async (config, username, value) =>
  oniPut({ config, path: ['prefs'], qs: prefsQs(username), data: { value } })

export { createPreferences, getPreferences, updatePreferences }
