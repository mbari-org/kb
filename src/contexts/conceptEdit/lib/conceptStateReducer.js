const conceptReducer = (state, action) => {
  switch (action.type) {
    case "INIT_STATE":
      return action.payload

    case "SET_FIELD":
      return {
        ...state,
        ...action.payload,
      }

    default:
      return state
  }
}

export default conceptReducer
