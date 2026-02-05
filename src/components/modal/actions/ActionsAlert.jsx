import { Alert } from '@mui/material'

const ActionsAlert = ({ lines, line1, line2, severity = 'info' }) => {
  const alertLines = Array.isArray(lines) ? lines : [line1, line2].filter(Boolean)

  return (
    <Alert severity={severity} sx={{ textAlign: 'center' }}>
      {alertLines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < alertLines.length - 1 && <br />}
        </span>
      ))}
    </Alert>
  )
}

export default ActionsAlert
