let mutationQueue = Promise.resolve()

const enqueueConceptMutation = mutate => {
  const run = mutationQueue.then(() => mutate())
  mutationQueue = run.catch(() => {})
  return run
}

export default enqueueConceptMutation
