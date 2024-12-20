import { use } from "react"

import AlertButton from "./AlertButton"
import AlertButtonsContainer from "./AlertButtonsContainer"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

const AlertButtonsConceptNameUpdate = () => {
  const { concept, conceptState } = use(ConceptContext)
  const { setModalAlert } = use(ModalContext)

  const choices = ["Cancel", "Name Only", "All Data"]

  const onChoice = choice => {
    switch (choice) {
      case "Cancel":
        break
      case "Name Only":
        break
      case "All Data":
        break
      default:
        break
    }
    console.log("conceptState name", conceptState.name)
    setModalAlert(null)
  }

  const disabled =
    concept.name !== conceptState.name
      ? [false, false, false]
      : [false, true, true]

  const buttonComponents = choices.map((choice, index) => (
    <AlertButton
      key={index}
      disabled={disabled[index]}
      choice={choice}
      index={index}
      totalChoices={choices.length}
      onChoice={onChoice}
    />
  ))

  return <AlertButtonsContainer buttons={buttonComponents} />
}

export default AlertButtonsConceptNameUpdate
