export const filterTemplates = (templates, filters = {}) => {
  const { concepts, toConcept, linkName, linkValue } = filters

  const trimmedLinkName = linkName?.trim()
  const trimmedLinkValue = linkValue?.trim()

  if (!concepts && !toConcept && !trimmedLinkName && !trimmedLinkValue) {
    return templates
  }

  let filteredTemplates = templates

  // Filter by concepts
  if (concepts) {
    filteredTemplates = filteredTemplates.filter(template => concepts.includes(template.concept))
  }

  // Filter by toConcept
  if (toConcept) {
    filteredTemplates = filteredTemplates.filter(template => template.toConcept === toConcept)
  }

  // Filter by linkName
  if (trimmedLinkName) {
    filteredTemplates = filteredTemplates.filter(template =>
      template.linkName?.toLowerCase().includes(trimmedLinkName.toLowerCase())
    )
  }

  // Filter by linkValue
  if (trimmedLinkValue) {
    filteredTemplates = filteredTemplates.filter(template =>
      template.linkValue?.toLowerCase().includes(trimmedLinkValue.toLowerCase())
    )
  }

  return filteredTemplates
}

export const isValidTemplate = template =>
  Boolean(
    template?.concept?.trim() &&
      template?.linkName?.trim() &&
      template?.linkValue?.trim() &&
      template?.toConcept?.trim()
  )
