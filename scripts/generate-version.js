#!/usr/bin/env node

/* global process */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

/**
 * Generate version string in format YYYY.MM.DD-commitHash
 * and write it to a file that can be imported by the React app
 */
function generateVersion() {
  try {
    // Get current date in YYYY.MM.DD format
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const dateString = `${year}.${month}.${day}`

    // Get current commit hash (short version)
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()

    // Get current branch name
    const branchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()

    // Get commit date
    const commitDate = execSync('git show -s --format=%ci HEAD', { encoding: 'utf8' }).trim()

    // Get commit message (first line only)
    const commitMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf8' })
      .trim()
      .split('\n')[0]

    // Check if working directory is clean
    const isWorkingDirClean = execSync('git status --porcelain', { encoding: 'utf8' }).trim() === ''

    // Create version object
    const versionInfo = {
      version: `${dateString}-${commitHash}`,
      buildDate: now.toISOString(),
      commitHash: commitHash,
      branchName: branchName,
      commitDate: commitDate,
      commitMessage: commitMessage,
      isDirty: !isWorkingDirClean,
    }

    // Write to src/version.js
    const versionFilePath = path.join(process.cwd(), 'src', 'version.js')
    const versionFileContent = `// This file is auto-generated during build. Do not edit manually.
export const VERSION_INFO = ${JSON.stringify(versionInfo, null, 2)}

export const getVersion = () => VERSION_INFO.version
export const getBuildDate = () => VERSION_INFO.buildDate
export const getCommitHash = () => VERSION_INFO.commitHash
export const getBranchName = () => VERSION_INFO.branchName
export const getCommitDate = () => VERSION_INFO.commitDate
export const getCommitMessage = () => VERSION_INFO.commitMessage
export const isDirty = () => VERSION_INFO.isDirty
`

    fs.writeFileSync(versionFilePath, versionFileContent)

    console.log(`✅ Version generated: ${versionInfo.version}`)
    console.log(`   Build date: ${versionInfo.buildDate}`)
    console.log(`   Branch: ${versionInfo.branchName}`)
    console.log(`   Commit: ${versionInfo.commitHash}`)
    console.log(`   Message: ${versionInfo.commitMessage}`)
    console.log(`   Working dir clean: ${isWorkingDirClean}`)

    return versionInfo
  } catch (error) {
    console.error('❌ Error generating version:', error.message)

    // Fallback version if git is not available or fails
    const fallbackVersion = {
      version: 'unknown',
      buildDate: new Date().toISOString(),
      commitHash: 'unknown',
      branchName: 'unknown',
      commitDate: 'unknown',
      commitMessage: 'unknown',
      isDirty: false,
    }

    const versionFilePath = path.join(process.cwd(), 'src', 'version.js')
    const versionFileContent = `// This file is auto-generated during build. Do not edit manually.
export const VERSION_INFO = ${JSON.stringify(fallbackVersion, null, 2)}

export const getVersion = () => VERSION_INFO.version
export const getBuildDate = () => VERSION_INFO.buildDate
export const getCommitHash = () => VERSION_INFO.commitHash
export const getBranchName = () => VERSION_INFO.branchName
export const getCommitDate = () => VERSION_INFO.commitDate
export const getCommitMessage = () => VERSION_INFO.commitMessage
export const isDirty = () => VERSION_INFO.isDirty
`

    fs.writeFileSync(versionFilePath, versionFileContent)
    return fallbackVersion
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateVersion()
}

export default generateVersion
