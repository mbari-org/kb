export const filterTemplates = (templates, filters = {}) => {
  if (!templates) return []

  const { concepts, toConcept, linkName, linkValue } = filters

  const trimmedLinkName = linkName?.trim().toLowerCase()
  const trimmedLinkValue = linkValue?.trim().toLowerCase()

  if (!concepts && !toConcept && !trimmedLinkName && !trimmedLinkValue) {
    return templates
  }

  let filteredTemplates = templates

  if (concepts) {
    filteredTemplates = filteredTemplates.filter(template => concepts.includes(template.concept))
  }

  if (toConcept) {
    filteredTemplates = filteredTemplates.filter(template => template.toConcept === toConcept)
  }

  if (trimmedLinkName) {
    filteredTemplates = filteredTemplates.filter(template => template.linkName?.toLowerCase().includes(trimmedLinkName))
  }

  if (trimmedLinkValue) {
    filteredTemplates = filteredTemplates.filter(template =>
      template.linkValue?.toLowerCase().includes(trimmedLinkValue)
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
