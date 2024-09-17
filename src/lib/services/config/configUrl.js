const storageKey = "config:url"

export const getConfigUrl = () => localStorage.getItem(storageKey) || ""

export const setConfigUrl = configUrl =>
  localStorage.setItem(storageKey, configUrl)
