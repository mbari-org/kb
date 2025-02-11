import { CiEdit } from "react-icons/ci"
import { IconButton } from "@mui/material"

const ChangeStructureButton = ({ onClick }) => {
  return (
    <IconButton
      aria-label="Edit concept name"
      color="main"
      onClick={onClick}
      sx={{
        mb: 2,
        ml: 0.5,
        padding: 0,
        "&:hover": {
          backgroundColor: `transparent !important`,
          transform: "scale(1.25)",
        },
      }}
    >
      <CiEdit size={24} />
    </IconButton>
  )
}

export default ChangeStructureButton
