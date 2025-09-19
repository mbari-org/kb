const csvEscape = field => {
  if (field == null) return ''
  const stringField = String(field)
  // If field contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`
  }
  return stringField
}

const csvHeaders = headers => headers.map(csvEscape).join(',') + '\n'

const csvOut = async (writable, dataRows) => {
  const csvRows = dataRows.map(row => row.map(csvEscape))
  const csvContent = csvRows.map(row => row.join(',')).join('\n')
  await writable.write(csvContent + '\n')
}

export {
  csvEscape,
  csvHeaders,
  csvOut,
}
