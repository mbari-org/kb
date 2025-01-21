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
  getPendingEdits,
  initialState,
  modified,
  modifyConcept,
  reset,
  selectConcept,
  setModalAlert,
  showBoundary,
  updateConcept,
  updateConceptName,
  editingState,
}) => {
  const { user } = use(AuthContext)

  const processError = useProcessError()
  const onContinue = useCallback(
    () => reset(initialState),
    [initialState, reset]
  )

  const submitDetailUpdates = useCallback(
    updates => {
      validateUpdates({
        concept,
        modifyConcept,
        setModalAlert,
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
                processError(error, onContinue)
                return
              }
              updateConcept(updatedConcept).then(
                () => {
                  reset(editingState)
                },
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
      config,
      modifyConcept,
      onContinue,
      processError,
      reset,
      setModalAlert,
      showBoundary,
      updateConcept,
      editingState,
      user,
    ]
  )

  const submitNameUpdate = useCallback(
    (extent, updates) => {
      nameUpdates({ concept, config, extent, updates }).then(
        ({ error, updatedName }) => {
          if (error) {
            processError(error, onContinue)
            return
          }
          updateConceptName(concept, updatedName).then(
            () => {
              selectConcept(updatedName)
              reset(editingState)
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
      onContinue,
      processError,
      reset,
      selectConcept,
      showBoundary,
      updateConceptName,
      editingState,
    ]
  )

  const submitUpdates = choice => {
    if (!modified) {
      reset(initialState)
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
        reset(initialState)
        break
      case "Info":
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
