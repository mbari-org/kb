import CONFIG from '@/lib/config'
import { createError } from '@/lib/errors'

const itemTitle = (field, action) => {
  const title = CONFIG.PANELS.CONCEPTS.MODALS.ITEM_TITLES[field]?.[action.toUpperCase()]
  if (!title) {
    throw createError('Invalid Item Title', `Cannot label ${field} action: ${action}`, { field, action })
  }
  return title
}

export default itemTitle
