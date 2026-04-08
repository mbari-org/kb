#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import process from 'process'

import {
  ensureCleanWorkingTree,
  ensureLintPasses,
  ensureMainBranch,
  ensureTestDeployPasses,
  ensureTestsPass,
  getVersionInfo,
  run,
} from './common.js'

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
  const existing = run('git', ['tag', '--list', version])
  if (existing) {
    throw new Error(`Tag "${version}" already exists.`)
  }
}

const commitAndTag = version => {
  run('git', ['add', 'package.json'])
  run('git', ['commit', '-m', `v${version}`])
  run('git', ['tag', version])
}

const main = async () => {
  ensureMainBranch()
  ensureCleanWorkingTree()
  await ensureLintPasses()
  await ensureTestsPass()
  await ensureTestDeployPasses()

  run('node', ['scripts/version/tag.js'])

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
