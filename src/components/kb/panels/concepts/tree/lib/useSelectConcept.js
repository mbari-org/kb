import { useCallback } from "react"

const useSelectConcept = (
  editing,
  modified,
  setModalAlert,
  setEditing,
  updateSelectedConcept,
  setAutoExpand
) => {
  return useCallback(
    conceptName => {
      if (editing && modified) {
        setModalAlert({
          message: "You have unsaved changes. Please Cancel or Save.",
          title: "Unsaved Changes",
          type: "warning",
        })
      } else {
        editing && setEditing(false)
        updateSelectedConcept(conceptName)
        setAutoExpand({ expand: true, name: conceptName })
      }
    },
    [
      editing,
      modified,
      setModalAlert,
      setEditing,
      updateSelectedConcept,
      setAutoExpand,
    ]
  )
}

export default useSelectConcept
