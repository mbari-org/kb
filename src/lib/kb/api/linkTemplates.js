import { oniGet } from '@/lib/services/oni/methods'

const fetchLinkTemplates = async (conceptName, config) =>
  oniGet(config, ['linktemplates', 'concept', conceptName])

export { fetchLinkTemplates }
