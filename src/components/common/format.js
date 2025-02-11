const formatDelta = (field, initial, pending) => {
  if (field === "nameUpdate") {
    return pending
  }
  return `${stringDisplay(initial)} --> ${stringDisplay(pending)}`
}

const formatField = field => {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const stringDisplay = field => (field !== "" ? field : '""')


export { formatDelta, formatField }
