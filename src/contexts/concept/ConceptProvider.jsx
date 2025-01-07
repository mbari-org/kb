import { use, useCallback, useEffect, useReducer, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"
import { useTheme } from "@mui/material/styles"

import ConceptContext from "@/contexts/concept/ConceptContext"

import ModalContext from "@/contexts/modal/ModalContext"
import SelectedContext from "@/contexts/selected/SelectedContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import conceptStateReducer from "./lib/conceptStateReducer"

import { filterUpdates } from "./lib/filterUpdates"
import { stateForConcept } from "./lib/stateForConcept"
import {
  isDetailValid,
  processDetailUpdates,
} from "./lib/process/detailUpdates"
import {
  processNameUpdate,
  UPDATE_ALL_DATA,
  UPDATE_NAME_ONLY,
} from "./lib/process/nameUpdates"
import { validateDetailUpdates } from "./lib/validate/validateDetailUpdates"

import useConceptPath from "./lib/useConceptPath"
import useProcessError from "./lib/useProcessError"
import useDisplayConceptEditsAlert from "./lib/useDisplayConceptEditsAlert"

import { isEmpty } from "@/lib/util"

const ConceptProvider = ({ children }) => {
  const theme = useTheme()

  const { showBoundary } = useErrorBoundary()

  const { modalAlert, setModalAlert } = use(ModalContext)
  const { selected, selectConcept, selectPanel } = use(SelectedContext)
  const {
    getConcept,
    getConceptPendingHistory,
    loadConcept,
    taxonomy,
    updateConcept,
    updateConceptName,
  } = use(TaxonomyContext)

  const [concept, setConcept] = useState(null)

  const [pendingHistory, setPendingHistory] = useState(null)

  const [editing, setEditing] = useState(false)
  const [modified, setModified] = useState(false)

  const [initialState, setInitialState] = useState(null)
  const [updatedState, dispatch] = useReducer(conceptStateReducer, {})

  const [modalHasBeenDiplayed, setModalAlertHasBeenDisplayed] = useState(false)

  const config = taxonomy.config

  const conceptPath = useConceptPath(concept)

  // filterUpdate returns a function but eslint isn't aware of that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCurrentUpdates = useCallback(filterUpdates(initialState), [
    initialState,
  ])

  const conceptUpdate = update =>
    dispatch({ type: "SET_FIELD", payload: update })

  const reset = useCallback(
    conceptState => {
      setEditing(false)
      setModified(false)
      setModalAlert(null)

      dispatch({ type: "INIT_STATE", payload: conceptState })
    },
    [setEditing, setModified, setModalAlert]
  )

  const processDetailResult = useCallback(
    updatedConcept => {
      updateConcept(updatedConcept).then(
        () => {
          selectConcept(updatedConcept.name)
          setInitialState(updatedState)
          reset(updatedState)
        },
        error => showBoundary(error)
      )
    },
    [reset, selectConcept, showBoundary, updateConcept, updatedState]
  )

  const processError = useProcessError(initialState, reset)

  const processNameResult = useCallback(
    updatedName => {
      updateConceptName(concept, updatedName).then(
        () => selectConcept(updatedName),
        error => showBoundary(error)
      )

      setModalAlert(null)
      setEditing(false)
      setModified(false)
    },
    [concept, selectConcept, setModalAlert, showBoundary, updateConceptName]
  )

  const submitUpdates = choice => {
    if (!modified) {
      reset(initialState)
      return
    }

    const updates = getCurrentUpdates(updatedState)

    switch (choice) {
      case "Cancel":
        reset(initialState)
        break
      case "Info":
        submitDetailUpdates(updates)
        break
      case "Name Only":
        submitNameUpdates(UPDATE_NAME_ONLY, updates)
        break
      case "All Data":
        submitNameUpdates(UPDATE_ALL_DATA, updates)
        break
      default:
        break
    }
  }

  const submitDetailUpdates = useCallback(
    updates => {
      validateDetailUpdates({
        concept,
        conceptUpdate,
        config,
        setModalAlert,
        theme,
        updates,
      }).then(validation => {
        if (isDetailValid(validation)) {
          processDetailUpdates({ concept, config, updates, validation }).then(
            ({ error, updatedConcept }) => {
              updatedConcept
                ? processDetailResult(updatedConcept)
                : processError(error)
            },
            error => showBoundary(error)
          )
        }
      })
    },
    [
      concept,
      config,
      processDetailResult,
      processError,
      setModalAlert,
      showBoundary,
      theme,
    ]
  )

  const submitNameUpdates = useCallback(
    (extent, updates) => {
      processNameUpdate({ concept, config, extent, updates }).then(
        ({ error, updatedName }) => {
          updatedName ? processNameResult(updatedName) : processError(error)
        },
        error => showBoundary(error)
      )
    },
    [concept, config, processError, processNameResult, showBoundary]
  )

  const editingAlertChoice = useCallback(
    choice => {
      switch (choice) {
        case "Discard Edits":
          reset(initialState)
          break
        case "Continue Editing":
          selectConcept(concept?.name)
          selectPanel("Concepts")
          break
        default:
          break
      }
      setModalAlert(null)
    },
    [concept, selectConcept, selectPanel, setModalAlert, reset, initialState]
  )

  const displayConceptEditsAlert = useDisplayConceptEditsAlert({
    getCurrentUpdates,
    updatedState,
    setModalAlert,
    reset,
    initialState,
    selectConcept,
    conceptName: concept?.name,
    selectPanel,
  })

  useEffect(() => {
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
          const concept = getConcept(selected.concept)
          setConcept(concept)
        },
        error => showBoundary(error)
      )
    }
  }, [
    concept,
    displayConceptEditsAlert,
    editing,
    editingAlertChoice,
    getConcept,
    getCurrentUpdates,
    loadConcept,
    modalAlert,
    modalHasBeenDiplayed,
    modified,
    selectConcept,
    selectPanel,
    selected,
    setModalAlert,
    showBoundary,
    updatedState,
  ])

  useEffect(() => {
    const hasUpdates = !isEmpty(getCurrentUpdates(updatedState))
    setModified(hasUpdates)
  }, [getCurrentUpdates, updatedState])

  useEffect(() => {
    if (concept) {
      const pendingHistory = getConceptPendingHistory(concept.name)
      setPendingHistory(pendingHistory)

      const conceptState = stateForConcept(concept)
      setInitialState(conceptState)
      dispatch({ type: "INIT_STATE", payload: conceptState })
    }
  }, [concept, getConceptPendingHistory])

  return (
    <ConceptContext
      value={{
        concept,
        conceptPath,
        conceptState: updatedState,
        conceptUpdate,
        displayConceptEditsAlert,
        editing,
        modified,
        pendingHistory,
        processUpdates: submitUpdates,
        setEditing,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
