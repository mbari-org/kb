const subtleCrypto = window.crypto.subtle || window.crypto.webkitSubtle
const IVL = 12
const algo = iv => ({ name: 'AES-GCM', iv: iv })

const subtleKey = async iv => {
  const pwUtf8 = new TextEncoder().encode('password')
  const pwHash = await subtleCrypto.digest('SHA-256', pwUtf8)
  return subtleCrypto.importKey('raw', pwHash, algo(iv), false, ['encrypt', 'decrypt'])
}

const genRefresh = async value => {
  const iv = crypto.getRandomValues(new Uint8Array(IVL))
  const ivStr = Array.from(iv)
    .map(b => String.fromCharCode(b))
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
    return { error: 'Extract failed' }
  }
}

export { extract, genRefresh }
