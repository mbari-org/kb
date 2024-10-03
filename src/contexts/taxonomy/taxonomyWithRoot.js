import { fromApi, load } from "@/model/concept"
import getRoot from "@/lib/services/oni/concept/root"

const taxonomyWithRoot = async config => {
  const { error: rootError, root } = await getRoot(config)
  if (!!rootError) {
    return { error: rootError }
  }

  // const taxonomy = {
  //   _root_: root.name,
  //   [root.name]: fromApi(root),
  // }

  const { error: childrenError, taxonomy: taxonomyWithChildren } = await load(
    config,
    { _root_: root.name },
    // taxonomy,
    root.name
  )

  if (!!childrenError) {
    return { error: childrenError }
  }

  return { taxonomy: taxonomyWithChildren }
}

export default taxonomyWithRoot
