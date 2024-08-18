import {Paper} from "@mui/material"
import {styled} from "@mui/material/styles"

const Box = styled(Paper)`
  padding: 20px;

  &.widget-bar a,
  &.widget-bar button {
    margin-right: 10px;
    text-transform: none;
    font-weight: normal;
    font-size: 13px;
    border-radius: 3px;
  }

  &.widget-bar a svg,
  &.widget-bar button svg {
    margin-right: 10px;
  }
`

export default Box
