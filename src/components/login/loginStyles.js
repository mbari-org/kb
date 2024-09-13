import { css } from "@emotion/react"
import theme from "@/themes/kb"

const loginStyles = css`
  /* Login-specific styles using the imported theme */
  &.actions {
    display: block;
    margin-top: ${theme.spacing * 2}px;
  }

  &.alternativeActions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &.content {
    width: 400px;
  }

  &.errorContainer {
    margin-top: ${theme.spacing}px;
    text-align: center;
    margin-bottom: ${theme.spacing * 2}px;
  }

  &.errorField {
    color: ${theme.colors.error.main};
    font-size: ${theme.spacing * 4}px;
    font-weight: ${theme.typography.fontWeightBold};
  }

  &.field {
    margin: ${theme.spacing}px;
    min-height: ${theme.spacing * 4}px;
  }

  &.forgotPassword {
    display: block;
    color: ${theme.colors.text.primary};
    margin-top: ${theme.spacing * 2}px;
    text-decoration: none;
    text-align: center;
  }
`

export default loginStyles
