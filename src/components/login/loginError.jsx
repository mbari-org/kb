import { css } from "@emotion/react"
import theme from "@/themes/kb"

const LoginError = ({ errorText }) => {
  return (
    <div
      className={css`
        margin-top: ${theme.spacing}px;
        text-align: center;
        margin-bottom: ${theme.spacing * 2}px;
      `}
    >
      <span
        className={css`
          color: ${theme.colors.error};
          font-size: ${theme.spacing * 4}px;
          font-weight: ${theme.typography.fontWeightBold};
        `}
      >
        {errorText}
      </span>
    </div>
  )
}

export default LoginError
