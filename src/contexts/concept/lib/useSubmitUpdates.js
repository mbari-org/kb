import { useCallback } from "react"

import useProcessResult from "./useProcessResult"
import { validateDetailUpdates } from "./validate/validateDetailUpdates"

import { isDetailValid, processDetailUpdates } from "./process/detailUpdates"
import {
  processNameUpdate,
  UPDATE_ALL_DATA,
  UPDATE_NAME_ONLY,
} from "./process/nameUpdates"

const useSubmitUpdates = ({
  concept,
  conceptUpdate,
  config,
  getCurrentUpdates,
  initialState,
  modified,
  reset,
  setModalAlert,
  showBoundary,
  theme,
  updateConcept,
  updateConceptName,
  updatedState,
}) => {
  const { processDetailResult, processNameResult, processErrorResult } =
    useProcessResult({
      concept,
      initialState,
      reset,
      setModalAlert,
      updateConcept,
      updateConceptName,
      updatedState,
    })

  const submitDetailUpdates = useCallback(
    updates => {
      validateDetailUpdates({
        concept,
        conceptUpdate,
        config,
        setModalAlert,
        theme,
        updates,
      }).then(validation => {
        if (isDetailValid(validation)) {
          processDetailUpdates({ concept, config, updates, validation }).then(
            ({ error, updatedConcept }) => {
              updatedConcept
                ? processDetailResult(updatedConcept)
                : processErrorResult(error)
            },
            error => showBoundary(error)
          )
        }
      })
    },
    [
      concept,
      conceptUpdate,
      config,
      processDetailResult,
      processErrorResult,
      setModalAlert,
      showBoundary,
      theme,
    ]
  )

  const submitNameUpdates = useCallback(
    (extent, updates) => {
      processNameUpdate({ concept, config, extent, updates }).then(
        ({ error, updatedName }) => {
          updatedName
            ? processNameResult(updatedName)
            : processErrorResult(error)
        },
        error => showBoundary(error)
      )
    },
    [concept, config, processErrorResult, processNameResult, showBoundary]
  )

  const submitUpdates = choice => {
    if (!modified) {
      reset(initialState)
      return
    }

    const updates = getCurrentUpdates(updatedState)

    switch (choice) {
      case "All Data":
        submitNameUpdates(UPDATE_ALL_DATA, updates)
        break
      case "Cancel":
        reset(initialState)
        break
      case "Info":
        submitDetailUpdates(updates)
        break
      case "Name Only":
        submitNameUpdates(UPDATE_NAME_ONLY, updates)
        break
      default:
        break
    }
  }

  return submitUpdates
}

export default useSubmitUpdates
