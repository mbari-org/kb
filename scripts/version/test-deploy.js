#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import process from 'process'

import { consoleMonitor, run } from './common.js'

const quickstartRoot = path.resolve('../vars-quickstart-public')
const quickstartNginxHtmlDir = path.join(quickstartRoot, 'temp/nginx/html')
const quickstartKbEditorDir = path.join(quickstartNginxHtmlDir, 'kbeditor')
const quickstartVarsqScript = path.join(quickstartRoot, 'varsq')
const distDir = path.resolve('dist')
const smokeUrl = process.env.VERSION_CHECK_SMOKE_URL || 'https://localhost/kbeditor/'
const smokeExpectedSnippet = process.env.VERSION_CHECK_SMOKE_SNIPPET || '/kbeditor/assets/'
const smokeMaxAttempts = Number.parseInt(process.env.VERSION_CHECK_SMOKE_MAX_ATTEMPTS || '12', 10)
const smokeRetryDelayMs = Number.parseInt(process.env.VERSION_CHECK_SMOKE_RETRY_DELAY_MS || '5000', 10)

const sleep = delayMs => new Promise(resolve => setTimeout(resolve, delayMs))

const ensureDirectoryExists = (directoryPath, label) => {
  if (!fs.existsSync(directoryPath)) {
    throw new Error(`${label} is missing at ${directoryPath}.`)
  }

  if (!fs.statSync(directoryPath).isDirectory()) {
    throw new Error(`${label} is not a directory: ${directoryPath}.`)
  }
}

const runNginxSmokeTest = async () => {
  // vars-quickstart-public terminates TLS at nginx; local certs are typically self-signed.
  const curlArgs = [
    '--fail',
    '--silent',
    '--show-error',
    '--location',
    '--insecure',
    '--max-time',
    '20',
    smokeUrl,
  ]

  for (let attempt = 1; attempt <= smokeMaxAttempts; attempt += 1) {
    try {
      const response = run('curl', curlArgs)
      if (!response.includes(smokeExpectedSnippet)) {
        throw new Error(
          `Smoke response did not include expected snippet "${smokeExpectedSnippet}" at ${smokeUrl}.`
        )
      }

      console.log(`✅ Nginx smoke test passed for ${smokeUrl}.`)
      return
    } catch (error) {
      if (attempt === smokeMaxAttempts) {
        throw new Error(
          `Nginx smoke test failed after ${smokeMaxAttempts} attempts for ${smokeUrl}: ${error.message}`,
          { cause: error }
        )
      }

      console.log(
        `⏳ Nginx smoke test attempt ${attempt}/${smokeMaxAttempts} failed. Retrying in ${smokeRetryDelayMs}ms...`
      )
      await sleep(smokeRetryDelayMs)
    }
  }
}

const ensureFileExists = (filePath, label) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} is missing at ${filePath}.`)
  }

  if (!fs.statSync(filePath).isFile()) {
    throw new Error(`${label} is not a file: ${filePath}.`)
  }
}

const verifyTestDeployPrerequisites = () => {
  ensureDirectoryExists(quickstartRoot, 'vars-quickstart-public repository')
  ensureDirectoryExists(quickstartNginxHtmlDir, 'vars-quickstart-public nginx html directory')
  ensureFileExists(quickstartVarsqScript, 'vars-quickstart-public varsq script')

  if (!fs.existsSync(quickstartKbEditorDir)) {
    fs.mkdirSync(quickstartKbEditorDir, { recursive: true })
  }
  ensureDirectoryExists(quickstartKbEditorDir, 'vars-quickstart-public kbeditor directory')
}

const main = async () => {
  verifyTestDeployPrerequisites()

  const buildCommand = 'yarn'
  const buildArgs = ['build']
  console.log(`🏗️ Running production build: ${buildCommand} ${buildArgs.join(' ')}`)
  await consoleMonitor(buildCommand, buildArgs, { label: 'Production build', intervalMs: 10000 })

  ensureDirectoryExists(distDir, 'dist output directory')

  const syncCommand = 'rsync'
  const syncArgs = ['-a', '--delete', `${distDir}/`, `${quickstartKbEditorDir}/`]
  console.log(`📦 Syncing dist into vars-quickstart-public: ${syncCommand} ${syncArgs.join(' ')}`)
  await consoleMonitor(syncCommand, syncArgs, { label: 'Asset sync', intervalMs: 5000 })

  // Static assets are volume-mounted from temp/nginx/html; restart is enough.
  const restartArgs = ['docker', 'restart', 'nginx']
  console.log(`🚀 Restarting nginx service: ${quickstartVarsqScript} ${restartArgs.join(' ')}`)
  await consoleMonitor(quickstartVarsqScript, restartArgs, {
    label: 'Nginx service restart',
    intervalMs: 10000,
  })
  console.log(`🔎 Running nginx smoke test against ${smokeUrl}`)
  await runNginxSmokeTest()

  console.log('✅ Test deploy completed successfully.')
}

main().catch(error => {
  console.error(`❌ Test deploy failed: ${error.message}`)
  process.exit(1)
})
