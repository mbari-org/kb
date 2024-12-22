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
import { submitDetailUpdates } from "./lib/submitDetailUpdates"
import {
  submitNameUpdates,
  UPDATE_ALL_DATA,
  UPDATE_NAME_ONLY,
} from "./lib/submitNameUpdates"
import { validateUpdates } from "./lib/validate/validateUpdates"

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
  const { getConcept, loadConcept, taxonomy, updateTaxonomy } =
    use(TaxonomyContext)

  const [concept, setConcept] = useState(null)

  const [editing, setEditing] = useState(false)
  const [modified, setModified] = useState(false)
  const [validation, setValidation] = useState(null)

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

  const updateConcept = update =>
    dispatch({ type: "SET_FIELD", payload: update })

  const cancelUpdates = useCallback(() => {
    dispatch({ type: "INIT_STATE", payload: initialState })
    setEditing(false)
    setModified(false)
    setValidation(null)
    setModalAlert(null)
  }, [initialState, setModalAlert])

  const processResult = useCallback(
    ({ error, updatedConcept }) => {
      if (!error) {
        setEditing(false)
        setModified(false)
        setValidation(null)
        setInitialState(updatedState)

        updateTaxonomy(updatedConcept)

        dispatch({ type: "INIT_STATE", payload: updatedState })
      } else {
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
      }

      setEditing(false)
      setModified(false)
      setValidation(null)
    },
    [initialState, setModalAlert, updateTaxonomy, updatedState]
  )

  const processUpdates = choice => {
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
        processInfoUpdates(config, updates)
        break
      case "Name Only":
        processNameUpdates(UPDATE_NAME_ONLY, updates)
        break
      case "All Data":
        processNameUpdates(UPDATE_ALL_DATA, updates)
        break
      default:
        break
    }
  }

  const processInfoUpdates = useCallback(
    updates => {
      validateUpdates({
        concept,
        config,
        setModalAlert,
        updateConcept,
        updates,
      }).then(updatesValidation => {
        setValidation(updatesValidation)
      })
    },
    [concept, config, setModalAlert]
  )

  const processNameUpdates = useCallback(
    (extent, updates) => {
      submitNameUpdates({ concept, config, extent, updates }).then(
        result => {
          processResult(result)
        },
        error => showBoundary(error)
      )
    },
    [concept, config, processResult, showBoundary]
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
      Title: createAlertTitle({
        title: "Current Edits",
        type: "warning",
      }),
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

  useEffect(() => {
    if (validation) {
      const updates = getCurrentUpdates(updatedState)
      submitDetailUpdates({ concept, config, updates, validation }).then(
        result => {
          processResult(result)
        },
        error => showBoundary(error)
      )
    }
  }, [
    concept,
    config,
    getCurrentUpdates,
    showBoundary,
    processResult,
    updatedState,
    validation,
  ])

  return (
    <ConceptContext
      value={{
        concept,
        conceptPath,
        conceptState: updatedState,
        displayConceptEditsAlert,
        editing,
        modified,
        processUpdates,
        setEditing,
        updateConcept,
      }}
    >
      {children}
    </ConceptContext>
  )
}

export default ConceptProvider
