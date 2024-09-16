import { Button } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import { useFormStatus } from "react-dom"

const LoginButton = () => {
  const theme = useTheme()

  const styles = {
    marginBottom: theme.spacing(1),
  }

  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} style={styles} type="submit" variant="contained">
      {pending ? "Login..." : "Login"}
    </Button>
  )
}

export default LoginButton
