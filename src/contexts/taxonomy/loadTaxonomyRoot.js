import { fromApi, load } from "@/model/concept"
import getRoot from "@/lib/services/oni/concept/root"

const loadTaxonomyRoot = async config => {
  const { error: rootError, root } = await getRoot(config)
  if (!!rootError) {
    return { error: rootError }
  }

  const { error: childrenError, taxonomy: taxonomyWithChildren } = await load(
    { _config_: config, _root_: root.name },
    root.name
  )

  if (!!childrenError) {
    return { error: childrenError }
  }

  return { taxonomy: taxonomyWithChildren }
}

export default loadTaxonomyRoot
