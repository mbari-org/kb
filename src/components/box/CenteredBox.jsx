import { Box, Typography } from "@mui/material"
import { css } from "@emotion/react"

const CenteredBox = ({
  children,
  variant,
  customClasses: classes,
  errorMessage,
  title,
  fullWidth = false,
}) => (
  <div className={`${classes.root} centered-box`}>
    <div className={classes.content}>
      <Box
        className={css({
          [classes.errorBox]: variant === "error",
          [classes.errorTitle]: variant === "error",
          [classes.errorMessage]: variant === "error",
        })}
      >
        <Typography
          className={css({
            [classes.errorTitle]: variant === "error",
          })}
          gutterBottom={variant !== "error"}
          variant="subtitle2"
        >
          {title}
        </Typography>
        {errorMessage && (
          <Typography
            className={css({
              [classes.errorMessage]: variant === "error",
            })}
            color={variant === "error" ? "initial" : "error"}
            gutterBottom={true}
            variant="caption"
          >
            {errorMessage}
          </Typography>
        )}
        {children}
      </Box>
    </div>
  </div>
)

export default CenteredBox
