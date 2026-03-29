import { useCallback, useEffect } from 'react'

import { checkConcept } from '@/lib/api/concept'
import { createError } from '@/lib/errors'
import { isEmpty } from '@/lib/utils'

import { PREFS } from '@/lib/constants/prefs.js'

const { KEY } = PREFS.USER

const CLEAN_FLAGS = {
  [KEY.CONCEPTS]: false,
  [KEY.PANELS]: false,
  [KEY.SETTINGS]: false,
}

const normalizeConceptPreferences = async (value, config) => {
  const normalized = normalizeHistoryPreferences(value)
  if (normalized.state.length === 0) {
    return normalized
  }

  const checks = await Promise.all(
    [...new Set(normalized.state)].map(async conceptName => ({
      conceptName,
      exists: await checkConcept(config, conceptName),
    }))
  )

  const conceptExists = checks.reduce((acc, result) => {
    acc[result.conceptName] = result.exists
    return acc
  }, {})

  const validState = []
  let removedBeforeOrAtPosition = 0
  normalized.state.forEach((conceptName, index) => {
    if (conceptExists[conceptName]) {
      validState.push(conceptName)
    } else if (index <= normalized.position) {
      removedBeforeOrAtPosition += 1
    }
  })

  return normalizeHistoryPreferences({
    ...normalized,
    state: validState,
    position: normalized.position - removedBeforeOrAtPosition,
  })
}

const normalizeHistoryPreferences = value => {
  const state = value?.state || []
  const rawPosition = value?.position ?? -1

  if (state.length === 0) {
    return { state, position: -1 }
  }

  if (rawPosition < 0) {
    return { state, position: 0 }
  }

  if (rawPosition >= state.length) {
    return { state, position: state.length - 1 }
  }

  return { state, position: rawPosition }
}

const isSameHistoryPreferences = (left, right) => {
  if (left.position !== right.position) {
    return false
  }

  if (left.state.length !== right.state.length) {
    return false
  }

  return left.state.every((name, index) => name === right.state[index])
}

const useInitPrefs = ({
  config,
  conceptSelection,
  createPreferences,
  getPreferences,
  panelSelection,
  preferencesInitialized,
  getSettings,
  getSettingsRef,
  onInitSettingsRef,
  setDirtyFlags,
  setIsLoading,
  setPreferencesInitialized,
  setServerPreferencesExist,
  showBoundary,
  rootName,
  updatePreferences,
  user,
}) => {
  const prefsValue = useCallback(
    key => {
      switch (key) {
        case KEY.CONCEPTS:
          return {
            state: conceptSelection.getState(),
            position: conceptSelection.getPosition(),
          }

        case KEY.PANELS:
          return {
            state: panelSelection.getState(),
            position: panelSelection.getPosition(),
          }

        case KEY.SETTINGS:
          return getSettings()

        default:
          throw createError('Invalid Preference Key', `Invalid preference key: ${key}`, { key })
      }
    },
    [conceptSelection, panelSelection, getSettings]
  )

  useEffect(() => {
    if (!user || preferencesInitialized) return

    const initializePreferences = async () => {
      setIsLoading(true)
      try {
        const allPrefs = await getPreferences()

        if (isEmpty(allPrefs)) {
          await Promise.all(
            Object.values(KEY).map(key => {
              return createPreferences(key, prefsValue(key))
            })
          )
          setServerPreferencesExist(true)
        } else {
          const normalizedConcepts = await normalizeConceptPreferences(allPrefs.concepts, config)
          const conceptsForInit =
            normalizedConcepts.state.length === 0
              ? normalizeHistoryPreferences({
                  state: [rootName],
                  position: 0,
                })
              : normalizedConcepts
          const normalizedPanels = normalizeHistoryPreferences(allPrefs.panels)
          const defaultPanelName = panelSelection.getState()[0] || 'Concepts'
          const panelsForInit =
            normalizedPanels.state.length === 0
              ? normalizeHistoryPreferences({
                  state: [defaultPanelName],
                  position: 0,
                })
              : normalizedPanels
          conceptSelection.init(conceptsForInit)
          panelSelection.init(panelsForInit)
          if (onInitSettingsRef?.current) {
            onInitSettingsRef.current(allPrefs.settings)
          }
          await Promise.all([
            isSameHistoryPreferences(allPrefs.concepts, conceptsForInit)
              ? Promise.resolve()
              : updatePreferences(KEY.CONCEPTS, conceptsForInit),
            isSameHistoryPreferences(allPrefs.panels, panelsForInit)
              ? Promise.resolve()
              : updatePreferences(KEY.PANELS, panelsForInit),
          ])
          setServerPreferencesExist(true)
        }

        setPreferencesInitialized(true)
        setDirtyFlags(CLEAN_FLAGS)
      } catch (error) {
        showBoundary(error)
      } finally {
        setIsLoading(false)
      }
    }

    initializePreferences()
  }, [
    config,
    conceptSelection,
    createPreferences,
    getPreferences,
    getSettingsRef,
    onInitSettingsRef,
    panelSelection,
    preferencesInitialized,
    prefsValue,
    setDirtyFlags,
    setIsLoading,
    setPreferencesInitialized,
    setServerPreferencesExist,
    showBoundary,
    rootName,
    updatePreferences,
    user,
  ])

  return { CLEAN_FLAGS, prefsValue }
}

export default useInitPrefs
