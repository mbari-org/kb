import AlertButton from "./AlertButton"
import AlertButtonsContainer from "./AlertButtonsContainer"

const AlertButtons = ({ choices, colors, onChoice }) => {
  const buttonColor = index => (colors ? colors[index] : "main")

  const buttonComponents = choices.map((choice, index) => (
    <AlertButton
      key={index}
      choice={choice}
      color={buttonColor(index)}
      index={index}
      totalChoices={choices.length}
      onChoice={onChoice}
    />
  ))

  return <AlertButtonsContainer buttons={buttonComponents} />
}

export default AlertButtons
