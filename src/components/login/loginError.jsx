import useLoginStyles from "./loginStyles"

const LoginError = ({ errorText }) => {
  const classes = useLoginStyles()

  return (
    <div className={classes.errorContainer}>
      <span className={classes.errorField}>{errorText}</span>
    </div>
  )
}

export default LoginError
