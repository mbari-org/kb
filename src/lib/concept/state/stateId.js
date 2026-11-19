import { puid } from 'puid-js'

const { generator, error: generatorError } = puid({ total: 10, risk: 1e15 })
if (generatorError) throw generatorError

const genStateId = () => generator()

export { genStateId }
