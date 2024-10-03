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

import AuthProvider from "@/contexts/auth/AuthProvider"
import ConfigProvider from "@/contexts/config/ConfigProvider"

import AuthRoute from "@/components/auth/AuthRoute"

import KbContainer from "@/components/KbContainer"
import StartUp from "@/components/StartUp"

const App = () => {
  return (
    <StrictMode>
      <ThemeProvider theme={kbTheme}>
        <CssBaseline />
        <Router>
          <ConfigProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<StartUp />} />
                <Route element={<AuthRoute />}>
                  <Route path="/kb" element={<KbContainer />}></Route>
                </Route>
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </AuthProvider>
          </ConfigProvider>
        </Router>
      </ThemeProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById("root")).render(<App />)
