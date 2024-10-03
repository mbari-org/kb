import { use } from "react"

import { Button } from "@mui/material"

import AuthContext from "@/contexts/auth/AuthContext"

const LogoutLink = () => {
  const { logout } = use(AuthContext)

  return (
    <Button color="inherit" onClick={logout}>
      Logout
    </Button>
  )
}

export default LogoutLink
