import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
} from "@mui/material"

const Login = () => {
  return (
    <Box component="main" sx={{ width: "100%", height: "100vh" }}>
      <Card sx={{ maxWidth: "500px", mx: "auto" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Email" />
          <TextField type="password" label="Password" />
        </CardContent>
        <CardActions>
          <Button sx={{ mx: "auto" }} variant="contained">
            Login
          </Button>
        </CardActions>
      </Card>
    </Box>
  )
}

export default Login
