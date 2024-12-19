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
import { submitUpdates } from "./lib/submitUpdates"
import { validateUpdates } from "./lib/validate/validateUpdates"

import {
  createAlertChoices,
  createErrorAlertMessage,
  createAlertTitle,
  createUnsavedEditsAlertMessage,
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
  }, [initialState])

  const processUpdates = save => {
    if (!save) {
      cancelUpdates()
      return
    }

    if (!modified) {
      setEditing(false)
      setValidation(null)
      return
    }

    const config = taxonomy.config
    const updates = getCurrentUpdates(updatedState)

    validateUpdates({
      concept,
      config,
      setModalAlert,
      updateConcept,
      updates,
    }).then(updatesValidation => {
      setValidation(updatesValidation)
    })
  }

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
          Content: createErrorAlertMessage({ error }),
          Choices: createAlertChoices({
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
      Content: createUnsavedEditsAlertMessage({ updates }),
      Choices: createAlertChoices({
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
  }, [getCurrentUpdates, updatedState, setModalAlert, cancelUpdates])

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
      } else {
        if (!modalAlert) {
          displayConceptEditsAlert()
        }
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
      const config = taxonomy.config
      const updates = getCurrentUpdates(updatedState)
      submitUpdates({ concept, config, updates, validation }).then(
        result => {
          processResult(result)
        },
        error => showBoundary(error)
      )
    }
  }, [
    concept,
    getCurrentUpdates,
    showBoundary,
    processResult,
    taxonomy.config,
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
