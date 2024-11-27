import { use, useCallback, useEffect, useReducer, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"

import ConceptContext from "./ConceptContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import conceptReducer from "./conceptReducer"

import { processChanges } from "./processChanges"

const ConceptProvider = ({ children, concept }) => {
  const { showBoundary } = useErrorBoundary()
  const { taxonomy } = use(TaxonomyContext)

  const [editable, setEditable] = useState(false)
  const [isModified, setIsModified] = useState(false)

  const [initialConceptState, setInitialConceptState] = useState(null)
  const [conceptState, dispatch] = useReducer(conceptReducer, {})

  const getChanges = useCallback(
    state => {
      if (!initialConceptState) return {}
      const changes = {}
      Object.keys(state).forEach(key => {
        if (state[key] !== initialConceptState[key]) {
          changes[key] = state[key]
        }
      })
      return changes
    },
    [initialConceptState]
  )

  const isStateModified = useCallback(
    state => {
      const modified =
        initialConceptState &&
        Object.keys(state).some(key => state[key] !== initialConceptState[key])

      setIsModified(modified)
    },
    [initialConceptState]
  )

  const setConcept = update => {
    dispatch({ type: "SET_FIELD", payload: update })
    isStateModified(conceptState)
  }

  const saveChanges = bool => {
    if (bool && isStateModified) {
      const changes = getChanges(conceptState)

      processChanges(concept.name, changes, taxonomy).then(
        wtf => {
          console.log("Updated concept fields:", wtf)
          setInitialConceptState(conceptState)
        },
        error => {
          showBoundary(error)
        }
      )
    } else if (!bool) {
      dispatch({ type: "INIT_STATE", payload: initialConceptState })
    }
    setEditable(false)
    setIsModified(false)
  }

  useEffect(() => {
    if (conceptState && initialConceptState) {
      isStateModified(conceptState)
    }
  }, [conceptState, initialConceptState, isStateModified])

  useEffect(() => {
    if (!concept) return

    const initialState = {
      author: concept.author || "unknown",
      rankLevel: concept.rankLevel || "",
      name: concept.name,
      media: concept.media,
      rankName: concept.rankName || "",
    }
    setInitialConceptState(initialState)

    dispatch({ type: "INIT_STATE", payload: initialState })
  }, [concept])

  return (
    <ConceptContext
      value={{
        conceptState,
        editable,
        setConcept,
        isModified,
        saveChanges,
        setEditable,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
