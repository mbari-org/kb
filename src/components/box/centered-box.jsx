import { Typography } from "@mui/material"
import withStyles from "@mui/styles/withStyles"

import cx from "classnames"
import { node, object, string } from "prop-types"

import Box from "./box"
import styles from "./centered-box-styles"

const BareBox = ({ children, variant, classes, errorMessage, title }) => (
  <div className={classes.root}>
    <div className={classes.content}>
      <Box className={cx({ [classes.errorBox]: variant === "error" })}>
        <Typography
          className={cx({ [classes.errorTitle]: variant === "error" })}
          gutterBottom={variant !== "error"}
          variant="subtitle2"
        >
          {title}
        </Typography>
        {errorMessage && (
          <Typography
            className={cx({ [classes.errorMessage]: variant === "error" })}
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

BareBox.propTypes = {
  children: node,
  classes: object.isRequired,
  errorMessage: string,
  title: string.isRequired,
  variant: string,
}

const styled = withStyles(styles)
const CenteredBox = styled(BareBox)

export default CenteredBox
