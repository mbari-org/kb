import Action from "./Action"
import ActionsContainer from "./ActionsContainer"

const Actions = ({ choices, colors, onChoice }) => {
  const buttonColor = index => (colors ? colors[index] : "main")

  const buttonComponents = choices.map((choice, index) => (
    <Action
      key={index}
      choice={choice}
      color={buttonColor(index)}
      index={index}
      totalChoices={choices.length}
      onChoice={onChoice}
    />
  ))

  return <ActionsContainer buttons={buttonComponents} />
}

export default Actions
