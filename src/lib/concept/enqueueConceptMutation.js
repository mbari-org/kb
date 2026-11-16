// Per-concept serialization of multi-step server mutations (staged save, admin
// delete, pending approval). A rename save changes the concept's identity mid-flight,
// so keying is by the concept name at flow start; taxonomy commits remain globally
// serialized through enqueueTaxonomyMutation.
const mutationQueues = new Map()

const enqueueConceptMutation = (conceptName, mutate) => {
  const run = (mutationQueues.get(conceptName) ?? Promise.resolve()).then(() => mutate())
  const tail = run.catch(() => {})
  mutationQueues.set(conceptName, tail)
  tail.finally(() => {
    if (mutationQueues.get(conceptName) === tail) {
      mutationQueues.delete(conceptName)
    }
  })
  return run
}

export default enqueueConceptMutation
