import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"
import { createRoot } from "react-dom/client"
import { StrictMode } from "react"

import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@emotion/react"
import theme from "@/themes/kb"

import AuthProvider from "@/components/auth/AuthProvider"
import AuthRoute from "@/components/auth/AuthRoute"
import KnowledgeBase from "@/components/KnowledgeBase"
import Login from "@/components/login/Login"

const App = () => {
  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route element={<AuthRoute />}>
                <Route path="/kb" element={<KnowledgeBase />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById("root")).render(<App />)
