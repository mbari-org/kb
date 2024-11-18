import { useCallback, useEffect, useReducer, useState } from "react"

import conceptReducer from "./conceptReducer"

import ConceptContext from "./ConceptContext"

const ConceptProvider = ({ children, concept }) => {
  const [editable, setEditable] = useState(false)
  const [isModified, setIsModified] = useState(false)

  const [initConceptState, setInitConceptState] = useState(null)
  const [conceptState, dispatch] = useReducer(conceptReducer, {})

  const isStateModified = useCallback(
    state => {
      const modified = Object.keys(state).some(
        key => state[key] !== initConceptState[key]
      )
      setIsModified(modified)
    },
    [initConceptState]
  )

  const setConcept = update => {
    dispatch({ type: "UPDATE_FIELD", payload: update })
    isStateModified(conceptState)
  }

  useEffect(() => {
    if (conceptState && initConceptState) {
      isStateModified(conceptState)
    }
  }, [conceptState, initConceptState, isStateModified])

  useEffect(() => {
    if (!concept) return

    const initialState = {
      author: concept.author || "unknown",
      level: concept.rankLevel || "",
      name: concept.name,
      media: concept.media,
      rank: concept.rankName || "",
    }
    setInitConceptState(initialState)

    dispatch({ type: "INIT_STATE", payload: initialState })
  }, [concept])

  return (
    <ConceptContext
      value={{ conceptState, editable, setConcept, isModified, setEditable }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
