import validateRankUpdates from "./validateRankUpdates"

const REMOVE_RANK_NAME_VALUE = "REMOVE"

const rankLevelNameValue = value =>
  value !== REMOVE_RANK_NAME_VALUE ? value : ""

const validateDetailUpdates = async updatesObject => {
  let rankValidation = await validateRankUpdates(updatesObject)

  return {
    author: true,
    ...rankValidation,
  }
}

export { rankLevelNameValue, REMOVE_RANK_NAME_VALUE, validateDetailUpdates }
