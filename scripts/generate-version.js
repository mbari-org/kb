import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const run = command => execSync(command, { encoding: 'utf8' }).trim()

const generateVersionInfo = () => {
  try {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const dateString = `${year}.${month}.${day}`

    const commitHash = run('git rev-parse --short HEAD')
    const branchName = run('git rev-parse --abbrev-ref HEAD')
    const commitDate = run('git show -s --format=%ci HEAD')
    const commitMessage = run('git log -1 --pretty=%B').split('\n').pop()
    const isWorkingDirClean = run('git status --porcelain') === ''

    return {
      branchName: branchName,
      buildDate: now.toISOString(),
      commitDate: commitDate,
      commitHash: commitHash,
      commitMessage: commitMessage,
      isDirty: !isWorkingDirClean,
      version: dateString,
    }
  } catch (error) {
    console.error('❌ Error generating version:', error.message)

    return {
      branchName: 'unknown',
      buildDate: new Date().toISOString(),
      commitDate: 'unknown',
      commitHash: 'unknown',
      commitMessage: 'unknown',
      isDirty: false,
      version: 'unknown',
    }
  }
}

const writeVersionFile = versionInfo => {
  const versionFilePath = path.resolve('src/version.js')
  const escapeForSingleQuote = value => String(value).replaceAll('\'', '\\\'')
  const formattedInfo = Object.entries(versionInfo)
    .map(([key, value]) => {
      const formattedValue =
        typeof value === 'string' ? `'${escapeForSingleQuote(value)}'` : value
      return `  ${key}: ${formattedValue},`
    })
    .join('\n')

  const versionFileContent = `// This file is auto-generated during build. Do not edit manually.
export const VERSION_INFO = {
${formattedInfo}
}

export const getBranchName = () => VERSION_INFO.branchName
export const getBuildDate = () => VERSION_INFO.buildDate
export const getCommitDate = () => VERSION_INFO.commitDate
export const getCommitHash = () => VERSION_INFO.commitHash
export const getCommitMessage = () => VERSION_INFO.commitMessage
export const getVersion = () => VERSION_INFO.version
export const isDirty = () => VERSION_INFO.isDirty
`

  fs.writeFileSync(versionFilePath, versionFileContent)
  return versionFilePath
}

const main = () => {
  const versionInfo = generateVersionInfo()
  const filePath = writeVersionFile(versionInfo)
  console.log(`✅ Version generated: ${versionInfo.version}`)
  console.log(`   File: ${filePath}`)
}

main()
