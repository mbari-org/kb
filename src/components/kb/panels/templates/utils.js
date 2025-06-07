export const isValidTemplate = template =>
  Boolean(
    template?.concept?.trim() &&
      template?.linkName?.trim() &&
      template?.linkValue?.trim() &&
      template?.toConcept?.trim()
  )
