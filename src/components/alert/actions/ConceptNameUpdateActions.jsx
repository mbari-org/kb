import { use } from "react"

import Action from "./Action"
import ActionsContainer from "./ActionsContainer"

import ConceptContext from "@/contexts/concept/ConceptContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const ConceptNameUpdateActions = () => {
  const { concept, editingState, processUpdates } = use(ConceptContext)
  const { getConceptNames } = use(TaxonomyContext)

  const choices = ["Cancel", "Name Only", "All Data"]

  const names = getConceptNames()

  const color = index => (index === 0 ? "cancel" : "main")

  const disabled =
    concept.name !== editingState.name && !names.includes(editingState.name)
      ? [false, false, false]
      : [false, true, true]

  const buttonComponents = choices.map((choice, index) => (
    <Action
      key={index}
      disabled={disabled[index]}
      choice={choice}
      color={color(index)}
      index={index}
      totalChoices={choices.length}
      onChoice={processUpdates}
    />
  ))

  return <ActionsContainer buttons={buttonComponents} />
}

export default ConceptNameUpdateActions
