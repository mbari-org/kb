import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const run = command => execSync(command, { encoding: 'utf8' }).trim()

const getCurrentBranch = () => run('git rev-parse --abbrev-ref HEAD')

const ensureCleanWorkingTree = () => {
  const status = run('git status --porcelain')
  if (status) {
    throw new Error('Working tree is dirty. Commit or stash changes first.')
  }
}

const ensureMainBranch = () => {
  const branch = getCurrentBranch()
  if (branch !== 'main') {
    throw new Error(`Expected branch "main", but on "${branch}".`)
  }
}

const getVersionInfo = async () => {
  const versionPath = path.resolve('src/version.js')
  const versionUrl = pathToFileURL(versionPath).href
  const { VERSION_INFO } = await import(versionUrl)
  if (!VERSION_INFO?.version || VERSION_INFO.version === 'unknown') {
    throw new Error('Version info is missing or unknown. Regenerate version first.')
  }
  return VERSION_INFO
}

const updatePackageJsonVersion = version => {
  const packageJsonPath = path.resolve('package.json')
  const rawPackageJson = fs.readFileSync(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(rawPackageJson)

  if (packageJson.version === version) {
    throw new Error(`package.json already at version ${version}.`)
  }

  packageJson.version = version
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
}

const ensureTagDoesNotExist = version => {
  const existing = run(`git tag --list ${version}`)
  if (existing) {
    throw new Error(`Tag "${version}" already exists.`)
  }
}

const commitAndTag = version => {
  run('git add package.json')
  run(`git commit -m "v${version}"`)
  run(`git tag ${version}`)
}

const main = async () => {
  ensureMainBranch()
  ensureCleanWorkingTree()

  run('node scripts/generate-version.js')

  const { version } = await getVersionInfo()
  ensureTagDoesNotExist(version)
  updatePackageJsonVersion(version)
  commitAndTag(version)

  console.log(`✅ Created release commit and tag for ${version}`)
}

main().catch(error => {
  console.error(`❌ Release failed: ${error.message}`)
  process.exit(1)
})
