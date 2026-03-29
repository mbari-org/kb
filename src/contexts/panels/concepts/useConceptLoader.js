import { useCallback, useEffect, useRef } from 'react'

const toLoadConceptError = (error, conceptName) => ({
  conceptName,
  message: error?.message || 'Failed to load concept',
  original: error?.original || error,
})

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
        const loadedConcept = getConcept(selectedConcept)
        if (!loadedConcept) {
          handleLoadConceptError(
            toLoadConceptError(
              new Error(`Concept marked loaded but lookup failed: ${selectedConcept}`),
              selectedConcept
            )
          )
          return
        }

        handleSetConcept(loadedConcept)
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
        if (!loadedConcept) {
          throw new Error(`Failed to load concept: ${conceptToLoad}`)
        }

        if (isMountedRef.current) {
          const currentSelected = getSelected('concept')
          if (currentSelected === conceptToLoad) {
            handleSetConcept(loadedConcept)
          }
        }
      } catch (error) {
        if (isMountedRef.current) {
          const currentSelected = getSelected('concept')
          if (currentSelected === selectedConcept) {
            handleLoadConceptError(toLoadConceptError(error, selectedConcept))
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
