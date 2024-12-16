import validateNameUpdate from "./validateNameUpdate"
import validateRankLevelUpdates from "./validateRankLevelUpdates"

const REMOVE_RANK_NAME_VALUE = "REMOVE"

const rankLevelNameValue = value =>
  value !== REMOVE_RANK_NAME_VALUE ? value : ""

const validateUpdates = async updatesObject => {
  const { alert: adminAlert } = validateRankLevelUpdates(updatesObject)
  if (adminAlert) return { alert: adminAlert }

  const { alert: nameAlert } = await validateNameUpdate(updatesObject)
  if (nameAlert) return { alert: nameAlert }

  return { alert: null }
}

export { rankLevelNameValue, REMOVE_RANK_NAME_VALUE, validateUpdates }
