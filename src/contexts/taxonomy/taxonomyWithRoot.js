import { fromApi } from "@/model/concept"
import getRoot from "@/lib/services/oni/concept/root"

const taxonomyWithRoot = async config => {
  const { error, root } = await getRoot(config)
  if (!!error) {
    return { error }
  }

  return {
    taxonomy: {
      _root_: root.name,
      [root.name]: fromApi(root),
    },
  }
}

export default taxonomyWithRoot
