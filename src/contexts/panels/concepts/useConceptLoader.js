import { useCallback, useEffect, useRef } from 'react'

// Custom hook to handle async concept loading with race condition protection
const useConceptLoader = ({
  getConcept,
  getSelected,
  handleLoadConceptError,
  handleSetConcept,
  isConceptLoaded,
  loadConcept,
  setEditing,
}) => {
  const isLoadingConcept = useRef(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const conceptLoader = useCallback(
    async selectedConcept => {
      if (isConceptLoaded(selectedConcept)) {
        handleSetConcept(getConcept(selectedConcept))
        return
      }

      if (isLoadingConcept.current) {
        return
      }

      try {
        isLoadingConcept.current = true
        setEditing(false)

        const conceptToLoad = selectedConcept

        const loadedConcept = await loadConcept(conceptToLoad)

        if (isMountedRef.current) {
          const currentSelected = getSelected('concept')
          if (currentSelected === conceptToLoad) {
            handleSetConcept(loadedConcept)
          }
        }
      } catch (error) {
        if (isMountedRef.current) {
          const currentSelected = getSelected('concept')
          if (error.conceptName === currentSelected) {
            handleLoadConceptError({ ...error, conceptName: selectedConcept })
          }
        }
      } finally {
        isLoadingConcept.current = false
      }
    },
    [
      getConcept,
      getSelected,
      handleLoadConceptError,
      handleSetConcept,
      isConceptLoaded,
      loadConcept,
      setEditing,
    ]
  )

  return conceptLoader
}

export default useConceptLoader
