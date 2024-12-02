import { use, useCallback } from "react"
import { useTheme } from "@mui/material/styles"

import { Box, Button, Typography } from "@mui/material"

import ModalContext from "@/contexts/modal/ModalContext"
import ModalTitledBox from "./ModalTitledBox"

const ModalError = () => {
  const theme = useTheme()
  const { modalError, setModalError } = use(ModalContext)

  const titleColor =
    modalError?.type === "error"
      ? theme.palette.error.main
      : theme.palette.primary.main

  const onClose = useCallback(() => {
    setModalError(null)
  }, [setModalError])

  if (!modalError) {
    return null
  }
  return (
    <ModalTitledBox
      open={!!modalError}
      onClose={onClose}
      title={modalError.title}
      sx={{ color: titleColor }}
    >
      <Typography id="modal-message" variant="h6" component="h3" sx={{ mt: 2 }}>
        {modalError.message}
      </Typography>
      {modalError.detail && (
        <Typography id="modal-message-detail" sx={{ mt: 1 }}>
          {modalError.detail}
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </Box>
    </ModalTitledBox>
  )
}

export default ModalError
