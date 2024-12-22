import { use } from "react"

import AlertButton from "./AlertButton"
import AlertButtonsContainer from "./AlertButtonsContainer"

import ConceptContext from "@/contexts/concept/ConceptContext"

const AlertButtonsConceptNameUpdate = () => {
  const { concept, conceptState, processUpdates } = use(ConceptContext)

  const choices = ["Cancel", "Name Only", "All Data"]

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
      onChoice={processUpdates}
    />
  ))

  return <AlertButtonsContainer buttons={buttonComponents} />
}

export default AlertButtonsConceptNameUpdate
