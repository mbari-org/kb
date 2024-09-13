import { useFormStatus } from "react-dom"
import { Button } from "@mui/material"

const LoginButton = () => {
  const { pending } = useFormStatus()
  return (
    <Button
      disabled={pending}
      type="submit"
      sx={{ mx: "auto", mb: 3 }}
      variant="contained"
    >
      {pending ? "Login..." : "Login"}
    </Button>
  )
}

export default LoginButton
