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
import TaxonomyProvider from "@/contexts/taxonomy/TaxonomyProvider"
import UserProvider from "@/contexts/user/UserProvider"

import AuthRoute from "@/components/auth/AuthRoute"

import KnowledgeBase from "@/components/KnowledgeBase"
import StartUp from "@/components/StartUp"

const App = () => {
  return (
    <StrictMode>
      <ThemeProvider theme={kbTheme}>
        <CssBaseline />
        <Router>
          <ConfigProvider>
            <AuthProvider>
              <TaxonomyProvider>
                <UserProvider>
                  <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<StartUp />} />
                    <Route element={<AuthRoute />}>
                      <Route path="/kb" element={<KnowledgeBase />}></Route>
                    </Route>
                    <Route
                      path="*"
                      element={<Navigate to="/login" replace />}
                    />
                  </Routes>
                </UserProvider>
              </TaxonomyProvider>
            </AuthProvider>
          </ConfigProvider>
        </Router>
      </ThemeProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById("root")).render(<App />)
