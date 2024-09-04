import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"
import { createRoot } from "react-dom/client"
import { StrictMode } from "react"

import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import kbTheme from "@/themes/kb"

import KnowledgeBase from "@/components/knowledgeBase"
import Login from "@/components/login/login"
import { isLoggedIn } from "@/lib/auth/login"

const App = () => {
  return (
    <StrictMode>
      <ThemeProvider theme={kbTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn() ? <KnowledgeBase /> : <Navigate to="/login" />
              }
            />
            <Route path="/kb" element={<KnowledgeBase />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById("root")).render(<App />)
