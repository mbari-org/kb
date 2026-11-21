import { oniUserPost } from '@/lib/services/oni/methods'

const createAlias = async (config, alias) => oniUserPost({ config, path: ['names'], data: alias })

export { createAlias }
