import { Button } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { useFormStatus } from "react-dom"

const SubmitButton = ({ buttonText, disabled, pendingText }) => {
  const theme = useTheme()

  const styles = {
    marginBottom: theme.spacing(1),
  }

  const { pending } = useFormStatus()
  return (
    <Button
      disabled={disabled || pending}
      style={styles}
      type="submit"
      variant="contained"
    >
      {pending ? pendingText : buttonText}
    </Button>
  )
}

export default SubmitButton
