import { execFileSync, spawn } from 'child_process'
import path from 'path'
import { pathToFileURL } from 'url'

export const run = (command, args = [], options = {}) =>
  execFileSync(command, args, { encoding: 'utf8', ...options }).trim()

export const consoleMonitor = (command, args = [], { label, intervalMs = 15000 }) =>
  new Promise((resolve, reject) => {
    const start = Date.now()
    const child = spawn(command, args, { stdio: 'inherit' })
    const timer = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - start) / 1000)
      console.log(`⏳ ${label} still running (${elapsedSeconds}s elapsed)...`)
    }, intervalMs)

    const cleanup = () => clearInterval(timer)

    child.on('error', error => {
      cleanup()
      reject(error)
    })

    child.on('close', code => {
      cleanup()
      if (code === 0) {
        const elapsedSeconds = Math.floor((Date.now() - start) / 1000)
        console.log(`✅ ${label} completed in ${elapsedSeconds}s.`)
        resolve()
        return
      }

      reject(new Error(`${label} failed with exit code ${code}`))
    })
  })

export const ensureCleanWorkingTree = () => {
  const status = run('git', ['status', '--porcelain'])
  if (status) {
    throw new Error('Working tree is dirty. Commit or stash changes first.')
  }
}

export const ensureMainBranch = () => {
  const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
  if (branch !== 'main') {
    throw new Error(`Expected branch "main", but on "${branch}".`)
  }
}

export const ensureLintPasses = async () => {
  const lintCommand = 'yarn'
  const lintArgs = ['lint']
  console.log(`🧹 Running lint validation: ${lintCommand} ${lintArgs.join(' ')}`)
  try {
    await consoleMonitor(lintCommand, lintArgs, { label: 'Lint validation', intervalMs: 10000 })
  } catch {
    throw new Error('Lint failed.')
  }
}

export const ensureTestsPass = async () => {
  const testCommand = 'yarn'
  const testArgs = ['vitest', 'run', '--pool=threads', '--maxWorkers=80%', '--reporter=dot']
  console.log(`🧪 Running test validation: ${testCommand} ${testArgs.join(' ')}`)
  try {
    await consoleMonitor(testCommand, testArgs, { label: 'Test validation' })
  } catch {
    throw new Error('Tests failed.')
  }
}

export const ensureTestDeployPasses = async () => {
  const testDeployCommand = 'node'
  const testDeployArgs = ['scripts/version/test-deploy.js']
  console.log(
    `🚢 Running test deploy validation: ${testDeployCommand} ${testDeployArgs.join(' ')}`
  )
  try {
    await consoleMonitor(testDeployCommand, testDeployArgs, {
      label: 'Test deploy validation',
      intervalMs: 10000,
    })
  } catch {
    throw new Error('Test deploy failed.')
  }
}

export const getVersionInfo = async () => {
  const versionPath = path.resolve('src/version.js')
  const versionUrl = pathToFileURL(versionPath).href
  const { VERSION_INFO } = await import(versionUrl)
  if (!VERSION_INFO?.version || VERSION_INFO.version === 'unknown') {
    throw new Error('Version info is missing or unknown. Regenerate version first.')
  }
  return VERSION_INFO
}
