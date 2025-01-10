import { useCallback } from "react"

import detailUpdates from "./submit/detailUpdates"
import nameUpdates from "./submit/nameUpdates"
import { validateUpdates } from "./submit/validateUpdates"

import useProcessError from "@/lib/hooks/useProcessError"

const UPDATE_ALL_DATA = "all"
const UPDATE_NAME_ONLY = "solo"

const allValid = values => Object.values(values).every(Boolean)

const useSubmitUpdates = ({
  concept,
  conceptUpdate,
  config,
  getCurrentUpdates,
  initialState,
  modified,
  reset,
  selectConcept,
  setModalAlert,
  showBoundary,
  updateConcept,
  updateConceptName,
  updatedState,
}) => {
  const processError = useProcessError()
  const onContinue = useCallback(
    () => reset(initialState),
    [initialState, reset]
  )

  const submitDetailUpdates = useCallback(
    updates => {
      validateUpdates({
        concept,
        conceptUpdate,
        setModalAlert,
        updates,
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
                  selectConcept(updatedConcept.name)
                  // reset(updatedState)
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
      conceptUpdate,
      config,
      onContinue,
      processError,
      selectConcept,
      setModalAlert,
      showBoundary,
      updateConcept,
    ]
  )

  const submitNameUpdates = useCallback(
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
      selectConcept,
      showBoundary,
      updateConceptName,
    ]
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
