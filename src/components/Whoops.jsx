import { ErrorBoundary } from "react-error-boundary"
import { useNavigate } from "react-router-dom"

import { Button } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import whoops from "@/assets/whoops.jpg"
import styled from "@emotion/styled"

import selectedStore from "@/lib/store/selected"

const WhoopsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

const WhoopsImage = styled.img`
  width: 50%;
  max-width: 350px;
  margin-bottom: 20px;
`

const ErrorMessage = styled.p`
  font-size: 18px;
  color: #666;
  text-align: center;
`

const Whoops = ({ children }) => {
  const navigate = useNavigate()
  const theme = useTheme()

  const renderWhoops = ({ error, resetErrorBoundary }) => (
    <WhoopsContainer>
      <WhoopsImage src={whoops} alt="Whoops!" />
      <ErrorMessage>{error.message}</ErrorMessage>
      <Button
        onClick={() => resetErrorBoundary()}
        sx={{ fontSize: `calc(${theme.typography.fontSize} * 1.5)` }}
      >
        Reset
      </Button>
    </WhoopsContainer>
  )

  const resetToRoot = () => {
    const currentSelected = selectedStore.get()
    selectedStore.set({ ...currentSelected, concept: null })
    navigate("/")
  }

  return (
    <ErrorBoundary fallbackRender={renderWhoops} onReset={resetToRoot}>
      {children}
    </ErrorBoundary>
  )
}

export default Whoops
