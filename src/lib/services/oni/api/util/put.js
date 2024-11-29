import { isAdmin } from "@/lib/services/oni/auth/validate"

import { oniParams } from "./params"
import { oniSend } from "./send"
import { oniUrl } from "./url"

const oniPut = async (config, path, data, requireAdmin = false) => {
  if (requireAdmin && !isAdmin()) {
    return
  }

  const params = oniParams("PUT", data)

  const url = oniUrl(config, path)
  return oniSend(url, params)
}

export { oniPut }
