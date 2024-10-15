import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ErrorBoundary } from "react-error-boundary"
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"

import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import kbTheme from "@/themes/kb"

import AuthProvider from "@/contexts/auth/AuthProvider"
import ConfigProvider from "@/contexts/config/ConfigProvider"

import AuthRoute from "@/components/auth/AuthRoute"

import KbContainer from "@/components/KbContainer"
import StartUp from "@/components/StartUp"
import Whoops from "@/components/kb/Whoops"

const App = () => {
  return (
    <StrictMode>
      <ThemeProvider theme={kbTheme}>
        <CssBaseline />
        <Router>
          <Whoops>
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
          </Whoops>
        </Router>
      </ThemeProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById("root")).render(<App />)
