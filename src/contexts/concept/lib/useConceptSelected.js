// src/hooks/useConceptManagement.js

import { useCallback, useEffect } from "react"

const useConceptSelected = ({
  selected,
  concept,
  editing,
  modified,
  modalAlert,
  modalHasBeenDiplayed,
  setEditing,
  setModalAlertHasBeenDisplayed,
  displayConceptEditsAlert,
  loadConcept,
  getConcept,
  showBoundary,
}) => {
  const handleConceptChange = useCallback(() => {
    if (!selected) {
      return
    }

    if (
      editing &&
      (selected.panel !== "Concepts" || selected.concept !== concept?.name)
    ) {
      if (!modified) {
        setEditing(false)
        return
      }

      if (!modalAlert && !modalHasBeenDiplayed) {
        displayConceptEditsAlert()
        setModalAlertHasBeenDisplayed(true)
        return
      }

      if (!modalAlert) {
        setModalAlertHasBeenDisplayed(false)
        return
      }

      return
    }

    if (selected.concept !== concept?.name) {
      loadConcept(selected.concept).then(
        () => {
          const loadedConcept = getConcept(selected.concept)
          // We'll need to pass a setter for concept here
          // setConcept(loadedConcept);
        },
        error => showBoundary(error)
      )
    }
  }, [
    concept,
    displayConceptEditsAlert,
    editing,
    getConcept,
    loadConcept,
    modalAlert,
    modalHasBeenDiplayed,
    modified,
    selected,
    setEditing,
    setModalAlertHasBeenDisplayed,
    showBoundary,
  ])

  useEffect(() => {
    handleConceptChange()
  }, [handleConceptChange])

  return {}
}

export default useConceptSelected
