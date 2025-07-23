const hasStaged = (initialValue, stagedValue) => initialValue !== stagedValue

const stagedBorder = (initialValue, stagedValue) =>
  hasStaged(initialValue, stagedValue)
    ? { borderColor: 'edit.main', borderStyle: 'dashed', borderWidth: '2px' }
    : { borderColor: 'transparent', borderStyle: 'none', borderWidth: '0px' }

export default stagedBorder
