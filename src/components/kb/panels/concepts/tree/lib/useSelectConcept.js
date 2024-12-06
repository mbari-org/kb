import { useCallback } from "react"

const useSelectConcept = (
  editable,
  isModified,
  setModalAlert,
  setEditable,
  updateSelectedConcept,
  setAutoExpand
) => {
  return useCallback(
    conceptName => {
      if (editable && isModified) {
        setModalAlert({
          message: "You have unsaved changes. Please Cancel or Save.",
          title: "Unsaved Changes",
          type: "warning",
        })
      } else {
        editable && setEditable(false)
        updateSelectedConcept(conceptName)
        setAutoExpand({ expand: true, name: conceptName })
      }
    },
    [
      editable,
      isModified,
      setModalAlert,
      setEditable,
      updateSelectedConcept,
      setAutoExpand,
    ]
  )
}

export default useSelectConcept
