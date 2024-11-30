import { isAdmin } from "@/lib/services/oni/auth/validate"

import { oniParams } from "./params"
import { oniSend } from "./send"
import { oniUrl } from "./url"

const oniPut = async (config, path, data, requireAdmin = false) => {
  const params = oniParams("PUT", data)
  const url = oniUrl(config, path)

  if (requireAdmin && !isAdmin()) {
    return {
      error: {
        detail: JSON.stringify(data),
        message: url,
        title: "Request requires Admin role",
      },
    }
  }

  return oniSend(url, params)
}

export { oniPut }
