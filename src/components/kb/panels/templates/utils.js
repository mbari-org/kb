export const filterTemplates = (templates, concepts, toConcept) => {
  if (!concepts && !toConcept) {
    return templates
  }

  if (!concepts) {
    return templates.filter(template => template.toConcept === toConcept)
  }

  const conceptTemplates = templates.filter(template => concepts.includes(template.concept))

  if (toConcept) {
    return conceptTemplates.filter(template => template.toConcept === toConcept)
  }

  return conceptTemplates
}

export const isValidTemplate = template =>
  Boolean(
    template?.concept?.trim() &&
      template?.linkName?.trim() &&
      template?.linkValue?.trim() &&
      template?.toConcept?.trim()
  )
