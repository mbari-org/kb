import { Paper } from "@mui/material"
import { css } from "@emotion/react"
import styled from "@emotion/styled"

const styles = css`
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

const StyledPaper = styled(Paper)`
  ${styles};
`

const Box = ({ className, ...props }) => (
  <StyledPaper className={className} {...props} />
)

export default Box
