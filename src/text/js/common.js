import exportConfig from '@/text/config/export.json'
import security from '@/text/config/security.json'
import templateFilters from '@/text/config/templateFilters.json'
import utils from '@/text/config/utils.json'

export const COMMON = {
  ...templateFilters,
  EXPORT: exportConfig,
  SECURITY: security,
  UTILS: utils,
}
