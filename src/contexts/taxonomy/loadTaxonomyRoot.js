import { load } from "@/model/taxonomy"
import getRoot from "@/lib/services/oni/concept/root"

const loadTaxonomyRoot = async config => {
  const { error: rootError, root } = await getRoot(config)
  if (!!rootError) {
    return { error: rootError }
  }

  const { error: loadError, taxonomy: taxonomyWithRoot } = await load(
    { _config_: config, _root_: root.name },
    root.name
  )

  if (!!loadError) {
    return { error: loadError }
  }

  return { taxonomy: taxonomyWithRoot }
}

export default loadTaxonomyRoot
