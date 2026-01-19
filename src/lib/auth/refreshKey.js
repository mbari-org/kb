import { COMMON } from '@/text'

const subtleCrypto = window.crypto.subtle || window.crypto.webkitSubtle
const IVL = COMMON.SECURITY.ENCRYPTION.IV_LENGTH
const ALGO_NAME = COMMON.SECURITY.ENCRYPTION.ALGORITHM
const HASH_ALGO = COMMON.SECURITY.ENCRYPTION.HASH_ALGORITHM
const PASSWORD = COMMON.SECURITY.ENCRYPTION.PASSWORD
const ACTIONS = COMMON.SECURITY.ENCRYPTION.ENCRYPTABLE_ACTIONS

const algo = iv => ({ name: ALGO_NAME, iv: iv })

const subtleKey = async iv => {
  const pwUtf8 = new TextEncoder().encode(PASSWORD)
  const pwHash = await subtleCrypto.digest(HASH_ALGO, pwUtf8)
  return subtleCrypto.importKey('raw', pwHash, algo(iv), false, ACTIONS)
}

const genRefresh = async value => {
  const iv = crypto.getRandomValues(new Uint8Array(IVL))
  const ivStr = Array.from(iv)
    .map(byte => String.fromCharCode(byte))
    .join('')

  const key = await subtleKey(iv)

  const ptUint8 = new TextEncoder().encode(value)
  const ctBuf = await subtleCrypto.encrypt(algo(iv), key, ptUint8)

  const ctArray = Array.from(new Uint8Array(ctBuf))
  const ctStr = ctArray.map(byte => String.fromCharCode(byte)).join('')

  return btoa(ivStr + ctStr)
}

const extract = async value => {
  const ivStr = atob(value).slice(0, IVL)
  const iv = new Uint8Array(Array.from(ivStr).map(ch => ch.charCodeAt(0)))

  const key = await subtleKey(iv)

  const ctStr = atob(value).slice(IVL)
  const ctUint8 = new Uint8Array(Array.from(ctStr).map(ch => ch.charCodeAt(0)))

  try {
    const ptBuf = await subtleCrypto.decrypt(algo(iv), key, ctUint8)
    return { password: new TextDecoder().decode(ptBuf) }
  } catch {
    return { error: COMMON.SECURITY.ERROR.EXTRACT_FAILED }
  }
}

export { extract, genRefresh }
