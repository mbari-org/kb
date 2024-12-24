// src/hooks/useConceptPath.js

import { useCallback, useMemo } from "react"

const useConceptPath = concept => {
  const getConceptPath = useCallback(
    (concept, path = [concept.name]) =>
      concept.parent
        ? getConceptPath(concept.parent, [concept.parent.name, ...path])
        : path,
    []
  )

  const conceptPath = useMemo(() => {
    if (concept) {
      return getConceptPath(concept)
    }
    return null
  }, [concept, getConceptPath])

  return conceptPath
}

export default useConceptPath
