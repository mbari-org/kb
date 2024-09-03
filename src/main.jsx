import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { createRoot } from "react-dom/client"
import { StrictMode } from "react"

import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import kbTheme from "@/themes/kb"

import KnowledgeBase from "@/components/knowledge-base"

const App = () => (
  <StrictMode>
    <ThemeProvider theme={kbTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<KnowledgeBase />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </ThemeProvider>
  </StrictMode>
)

createRoot(document.getElementById("root")).render(<App />)
