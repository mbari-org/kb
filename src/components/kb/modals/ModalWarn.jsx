import { use } from "react"

import { Box, Button, Typography } from "@mui/material"

import ModalContext from "@/contexts/modal/ModalContext"
import ModalTitledBox from "./ModalTitledBox"

const ModalWarn = () => {
  const { modalWarn, setModalWarn } = use(ModalContext)

  const onClose = () => {
    setModalWarn(null)
  }

  if (!modalWarn) {
    return null
  }

  return (
    <ModalTitledBox
      open={!!modalWarn}
      onClose={onClose}
      title={modalWarn.title}
      sx={{ color: "error.main" }}
    >
      <Typography id="modal-message" variant="h6" component="h3" sx={{ mt: 2 }}>
        {modalWarn.message}
      </Typography>
      {modalWarn.detail && (
        <Typography id="modal-message-detail" sx={{ mt: 1 }}>
          {modalWarn.detail}
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </Box>
    </ModalTitledBox>
  )
}

export default ModalWarn
