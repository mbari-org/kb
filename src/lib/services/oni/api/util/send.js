const oniSend = async (url, params) => {
  try {
    const response = await fetch(url, params)
    const payload = await response.json()

    if (response.status !== 200) {
      throw new Error(payload.message)
    }

    return payload
  } catch (error) {
    console.error(`Error processing ${url}:`, error)
    throw new Error(`Error processing ${url}: ${error.message}`)
  }
}

export { oniSend }
