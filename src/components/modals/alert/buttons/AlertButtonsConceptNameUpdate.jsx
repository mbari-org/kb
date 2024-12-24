import { use } from "react"

import { useTheme } from "@mui/material/styles"

import AlertButton from "./AlertButton"
import AlertButtonsContainer from "./AlertButtonsContainer"

import ConceptContext from "@/contexts/concept/ConceptContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

const AlertButtonsConceptNameUpdate = () => {
  const theme = useTheme()

  const { concept, conceptState, processUpdates } = use(ConceptContext)
  const { getConceptNames } = use(TaxonomyContext)

  const choices = ["Cancel", "Name Only", "All Data"]

  const names = getConceptNames()

  const color = index =>
    index === 0 ? theme.color.cancel : theme.palette.primary.main

  const disabled =
    concept.name !== conceptState.name && !names.includes(conceptState.name)
      ? [false, false, false]
      : [false, true, true]

  const buttonComponents = choices.map((choice, index) => (
    <AlertButton
      key={index}
      disabled={disabled[index]}
      choice={choice}
      color={color(index)}
      index={index}
      totalChoices={choices.length}
      onChoice={processUpdates}
    />
  ))

  return <AlertButtonsContainer buttons={buttonComponents} />
}

export default AlertButtonsConceptNameUpdate
