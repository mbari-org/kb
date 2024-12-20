import AlertButton from "./AlertButton"
import AlertButtonsContainer from "./AlertButtonsContainer"

const AlertButtons = ({ choices, onChoice }) => {
  const buttonComponents = choices.map((choice, index) => (
    <AlertButton
      key={index}
      choice={choice}
      index={index}
      totalChoices={choices.length}
      onChoice={onChoice}
    />
  ))

  return <AlertButtonsContainer buttons={buttonComponents} />
}

export default AlertButtons
