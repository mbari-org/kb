const authorState = concept => {
  const { author } = concept
  return {
    author: author || '',
  }
}

const editAuthor = (state, update) => {
  const { value } = update
  return { ...state, author: value }
}

const resetAuthor = (state, update) => {
  return { ...state, author: update.author }
}

export { authorState, editAuthor, resetAuthor }
