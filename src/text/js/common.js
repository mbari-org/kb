import common from '@/text/config/common.json'
import errors from '@/text/config/errors.json'
import exportConfig from '@/text/config/export.json'
import security from '@/text/config/security.json'
import utils from '@/text/config/utils.json'

export const COMMON = {
  ...common,
  ERRORS: errors,
  EXPORT: exportConfig,
  SECURITY: security,
  UTILS: utils,
}
