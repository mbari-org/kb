import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import kbTheme from "@/themes/kb"

import KnowledgeBase from "@/components/knowledge-base"

const App = () => (
  <StrictMode>
    <ThemeProvider theme={kbTheme}>
      <CssBaseline />
      <KnowledgeBase />
    </ThemeProvider>
  </StrictMode>
)

createRoot(document.getElementById("root")).render(<App />)
