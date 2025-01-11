const render = ({ error }) => {
  return (
    <div role="alert">
      <p>Whoops:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  )
}

const reset = _details => {}

export { render, reset }
