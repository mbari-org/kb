import exportConfig from '@/config/export.json'
import security from '@/config/security.json'
import templateFilters from '@/config/templateFilters.json'
import utils from '@/config/utils.json'

export const COMMON = {
  ...templateFilters,
  EXPORT: exportConfig,
  SECURITY: security,
  UTILS: utils,
}
