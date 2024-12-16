import validateNameUpdate from "./validateNameUpdate"
import validateRankUpdates from "./validateRankUpdates"

const REMOVE_RANK_NAME_VALUE = "REMOVE"

const rankLevelNameValue = value =>
  value !== REMOVE_RANK_NAME_VALUE ? value : ""

const validateUpdates = async updatesObject => {
  let rankValidation = await validateRankUpdates(updatesObject)
  let nameValidation = await validateNameUpdate(updatesObject)

  return {
    author: true,
    ...rankValidation,
    ...nameValidation,
  }
}

export { rankLevelNameValue, REMOVE_RANK_NAME_VALUE, validateUpdates }
