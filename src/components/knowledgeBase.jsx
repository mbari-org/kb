import { Button } from "@mui/material"

import { clearAuth } from "@/lib/auth/user"

function KnowledgeBase({ navigate, setUser, _user }) {
  const handleLogout = async () => {
    await clearAuth()
    // navigate("/")
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Button
        variant="contained"
        style={{ position: "fixed", top: 10, right: 10 }}
        onClick={handleLogout}
      >
        Logout
      </Button>
      <h2
        style={{
          textAlign: "center",
          margin: "3em 0 auto",
          marginBottom: "1em",
        }}
      >
        Herein lies great knowledge of all ocean creatures, far and wide.
      </h2>
    </div>
  )
}

export default KnowledgeBase
