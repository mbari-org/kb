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

import AuthProvider from "@/components/auth/AuthProvider"
import AuthRoute from "@/components/auth/AuthRoute"

import StartUp from "@/components/StartUp"

import KnowledgeBase from "@/components/KnowledgeBase"
import AboutHelp from "@/components/panels/AboutHelp"
import Concepts from "@/components/panels/Concepts"
import Embargoes from "@/components/panels/Embargoes"
import History from "@/components/panels/History"
import ImportExport from "@/components/panels/ImportExport"
import Notes from "@/components/panels/Notes"
import References from "@/components/panels/References"
import Templates from "@/components/panels/Templates"

const App = () => {
  return (
    <StrictMode>
      <ThemeProvider theme={kbTheme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<StartUp />} />
              <Route element={<AuthRoute />}>
                <Route path="/kb" element={<KnowledgeBase />}>
                  <Route path="about-help" element={<AboutHelp />} />
                  <Route path="concepts" element={<Concepts />} />
                  <Route path="embargoes" element={<Embargoes />} />
                  <Route path="history" element={<History />} />
                  <Route path="import-export" element={<ImportExport />} />
                  <Route path="notes" element={<Notes />} />
                  <Route path="references" element={<References />} />
                  <Route path="templates" element={<Templates />} />
                </Route>
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
