import {
  use,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react"
import { useErrorBoundary } from "react-error-boundary"

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

import {
  createAlertButtons,
  createAlertContentText,
  createAlertTitle,
  createAlertContentUnsavedEdits,
} from "@/components/modals/alert/components"

import { isEmpty } from "@/lib/util"

const ConceptProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { modalAlert, setModalAlert } = use(ModalContext)
  const { selected, selectConcept, selectPanel } = use(SelectedContext)
  const {
    getConcept,
    loadConcept,
    taxonomy,
    updateConcept,
    updateConceptName,
  } = use(TaxonomyContext)

  const [concept, setConcept] = useState(null)

  const [editing, setEditing] = useState(false)
  const [modified, setModified] = useState(false)

  const [initialState, setInitialState] = useState(null)
  const [updatedState, dispatch] = useReducer(conceptStateReducer, {})

  const [modalHasBeenDiplayed, setModalAlertHasBeenDisplayed] = useState(false)

  const config = taxonomy.config

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
  }, [concept, getConceptPath])

  // filterUpdate returns a function but eslint isn't aware of that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCurrentUpdates = useCallback(filterUpdates(initialState), [
    initialState,
  ])

  const conceptUpdate = update =>
    dispatch({ type: "SET_FIELD", payload: update })

  const cancelUpdates = useCallback(() => {
    dispatch({ type: "INIT_STATE", payload: initialState })
    setEditing(false)
    setModified(false)
    setModalAlert(null)
  }, [initialState, setModalAlert])

  const processDetailResult = useCallback(
    updatedConcept => {
      updateConcept(updatedConcept)

      selectConcept(updatedConcept.name)
      setInitialState(updatedState)

      dispatch({ type: "INIT_STATE", payload: updatedState })

      setModalAlert(null)
      setEditing(false)
      setModified(false)
    },
    [selectConcept, setModalAlert, updateConcept, updatedState]
  )

  const processError = useCallback(
    error => {
      setModalAlert({
        Title: createAlertTitle({
          title: "Update Error",
          type: "error",
        }),
        Content: createAlertContentText({
          text: error.message,
          type: "error",
        }),
        Choices: createAlertButtons({
          choices: ["Continue"],
          onChoice: () => {
            setInitialState(initialState)
            dispatch({ type: "INIT_STATE", payload: initialState })
            setModalAlert(null)
          },
        }),
      })
    },
    [initialState, setModalAlert]
  )

  const processNameResult = useCallback(
    updatedName => {
      updateConceptName(concept, updatedName)
      selectConcept(updatedName)

      // CxInc - need to get the updated concept

      setModalAlert(null)
      setEditing(false)
      setModified(false)
    },
    [concept, selectConcept, setModalAlert, updateConceptName]
  )

  const submitUpdates = choice => {
    if (!modified) {
      cancelUpdates()
      return
    }

    const updates = getCurrentUpdates(updatedState)

    switch (choice) {
      case "Cancel":
        cancelUpdates()
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
          cancelUpdates()
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
    [cancelUpdates, concept, selectConcept, selectPanel, setModalAlert]
  )

  const createUnsavedEditsModalAlert = ({ onChoice, updates }) => {
    return {
      Title: createAlertTitle({ title: "Current Edits" }),
      Content: createAlertContentUnsavedEdits({ updates }),
      Choices: createAlertButtons({
        choices: ["Discard Edits", "Continue Editing"],
        onChoice,
      }),
    }
  }

  const displayConceptEditsAlert = useCallback(() => {
    const onChoice = choice => {
      switch (choice) {
        case "Discard Edits":
          cancelUpdates()
          break
        case "Continue Editing":
          setEditing(true)
          selectConcept(concept?.name)
          selectPanel("Concepts")
          break
        default:
          break
      }
      setModalAlert(null)
    }

    const updates = getCurrentUpdates(updatedState)
    const conceptEditingModalAlert = createUnsavedEditsModalAlert({
      onChoice,
      updates,
    })
    setModalAlert(conceptEditingModalAlert)
  }, [
    getCurrentUpdates,
    updatedState,
    setModalAlert,
    cancelUpdates,
    selectConcept,
    concept?.name,
    selectPanel,
  ])

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
    // }
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
      const conceptState = stateForConcept(concept)
      setInitialState(conceptState)
      dispatch({ type: "INIT_STATE", payload: conceptState })
    }
  }, [concept])

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
        processUpdates: submitUpdates,
        setEditing,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
