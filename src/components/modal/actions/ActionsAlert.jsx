import { Alert } from '@mui/material'

const ActionsAlert = ({ lines, severity = 'info' }) => {
  return (
    <Alert severity={severity} sx={{ textAlign: 'center' }}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </Alert>
  )
}

export default ActionsAlert
