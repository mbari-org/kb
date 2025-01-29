import { use, useCallback } from "react"

import detailUpdates from "./submit/detailUpdates"
import nameUpdates from "./submit/nameUpdates"
import validateUpdates from "./submit/validateUpdates"

import AuthContext from "@/contexts/auth/AuthContext"

import useProcessError from "@/lib/hooks/useProcessError"

export const UPDATE_ALL_DATA = "all"
export const UPDATE_NAME_ONLY = "solo"

const allValid = values => Object.values(values).every(Boolean)

const useSubmitUpdates = ({
  concept,
  config,
  editingState,
  getPendingEdits,
  initialState,
  modified,
  modifyConcept,
  ranks,
  resetState,
  selectConcept,
  setAlert,
  showBoundary,
  updateConcept,
  updateConceptName,
}) => {
  const { user } = use(AuthContext)

  const processError = useProcessError()

  const onAction = useCallback(
    () => resetState(initialState),
    [initialState, resetState]
  )

  const submitDetailUpdates = useCallback(
    updates => {
      validateUpdates({
        concept,
        modifyConcept,
        ranks,
        setAlert,
        updates,
        user,
      }).then(detailValidation => {
        if (allValid(detailValidation)) {
          detailUpdates({
            concept,
            config,
            updates,
            validation: detailValidation,
          }).then(
            ({ error, updatedConcept }) => {
              if (error) {
                processError(error)
                return
              }
              updateConcept(updatedConcept).then(
                () => resetState(editingState),
                error => showBoundary(error)
              )
            },
            error => showBoundary(error)
          )
        }
      })
    },
    [
      concept,
      modifyConcept,
      ranks,
      setAlert,
      user,
      config,
      updateConcept,
      processError,
      resetState,
      editingState,
      showBoundary,
    ]
  )

  const submitNameUpdate = useCallback(
    (extent, updates) => {
      nameUpdates({ concept, config, extent, updates }).then(
        ({ error, updatedName }) => {
          if (error) {
            processError(error, onAction)
            return
          }
          updateConceptName(concept, updatedName).then(
            () => {
              selectConcept(updatedName)
              resetState(editingState)
            },
            error => showBoundary(error)
          )
        },
        error => showBoundary(error)
      )
    },
    [
      concept,
      config,
      onAction,
      processError,
      resetState,
      selectConcept,
      showBoundary,
      updateConceptName,
      editingState,
    ]
  )

  const submitUpdates = choice => {
    if (!modified) {
      resetState(initialState)
      return
    }

    const pendingEdits = getPendingEdits(editingState)
    const updates = Object.keys(pendingEdits).reduce((acc, key) => {
      acc[key] = pendingEdits[key].pending
      return acc
    }, {})

    switch (choice) {
      case "All Data":
        submitNameUpdate(UPDATE_ALL_DATA, updates)
        break
      case "Cancel":
        resetState(initialState)
        break
      case "Detail":
        submitDetailUpdates(updates)
        break
      case "Name Only":
        submitNameUpdate(UPDATE_NAME_ONLY, updates)
        break
      default:
        break
    }
  }

  return submitUpdates
}

export default useSubmitUpdates
