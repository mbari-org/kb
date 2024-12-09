import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ModalBox from "./ModalBox"

const ModalTitledBox = ({ children, open, modalAlert }) => {
  const theme = useTheme()

  const color =
    modalAlert.type === "error"
      ? theme.palette.error.main
      : theme.palette.primary.main

  return (
    <ModalBox backgroundColor={theme.palette.background.paper} open={open}>
      <Typography
        id="modal-titled-box"
        variant="h5"
        component="h2"
        sx={{
          borderBottom: "1px solid #000",
          color,
          fontWeight: "bold",
          pb: 1,
          textAlign: "center",
          width: "100%",
        }}
      >
        {modalAlert.title}
      </Typography>
      {children}
    </ModalBox>
  )
}

export default ModalTitledBox
