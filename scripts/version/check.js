#!/usr/bin/env node

import process from 'process'

import { ensureCleanWorkingTree, ensureLintPasses, ensureTestDeployPasses, ensureTestsPass } from './common.js'

const main = async () => {
  ensureCleanWorkingTree()
  await ensureLintPasses()
  await ensureTestsPass()
  await ensureTestDeployPasses()
  console.log('✅ Release pre-checks passed.')
}

main().catch(error => {
  console.error(`❌ Check failed: ${error.message}`)
  process.exit(1)
})
