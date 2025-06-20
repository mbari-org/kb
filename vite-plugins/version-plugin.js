import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

/**
 * Vite plugin for automatic version generation with HMR support
 */
export function versionPlugin() {
  let server

  function generateVersionInfo() {
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
      const isWorkingDirClean =
        execSync('git status --porcelain', { encoding: 'utf8' }).trim() === ''

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

      return versionInfo
    } catch (error) {
      console.error('❌ Error generating version:', error.message)

      // Fallback version if git is not available or fails
      return {
        version: 'unknown',
        buildDate: new Date().toISOString(),
        commitHash: 'unknown',
        branchName: 'unknown',
        commitDate: 'unknown',
        commitMessage: 'unknown',
        isDirty: false,
      }
    }
  }

  function writeVersionFile(versionInfo) {
    const versionFilePath = path.resolve('src/lib/version.js')
    const versionFileContent = `// This file is auto-generated during build. Do not edit manually.
export const VERSION_INFO = ${JSON.stringify(versionInfo, null, 2)};

export const getVersion = () => VERSION_INFO.version;
export const getBuildDate = () => VERSION_INFO.buildDate;
export const getCommitHash = () => VERSION_INFO.commitHash;
export const getBranchName = () => VERSION_INFO.branchName;
export const getCommitDate = () => VERSION_INFO.commitDate;
export const getCommitMessage = () => VERSION_INFO.commitMessage;
export const isDirty = () => VERSION_INFO.isDirty;
`

    fs.writeFileSync(versionFilePath, versionFileContent)
    return versionFilePath
  }

  return {
    name: 'version-plugin',

    buildStart() {
      // Generate version file at build start
      const versionInfo = generateVersionInfo()
      const filePath = writeVersionFile(versionInfo)

      console.log(`✅ Version generated: ${versionInfo.version}`)
      console.log(`   Build date: ${versionInfo.buildDate}`)
      console.log(`   Branch: ${versionInfo.branchName}`)
      console.log(`   Commit: ${versionInfo.commitHash}`)
      console.log(`   Working dir clean: ${!versionInfo.isDirty}`)

      // Add the version file to Vite's watch list in dev mode
      if (server) {
        this.addWatchFile(filePath)
      }
    },

    configureServer(viteServer) {
      server = viteServer

      // Add a middleware to regenerate version on demand
      server.middlewares.use('/api/regenerate-version', (req, res) => {
        if (req.method === 'POST') {
          try {
            const versionInfo = generateVersionInfo()
            const filePath = writeVersionFile(versionInfo)

            // Trigger HMR for the version file
            const module = server.moduleGraph.getModuleById(filePath)
            if (module) {
              server.reloadModule(module)
            }

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(
              JSON.stringify({
                success: true,
                version: versionInfo.version,
                message: 'Version regenerated successfully',
              })
            )

            console.log(`🔄 Version regenerated: ${versionInfo.version}`)
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(
              JSON.stringify({
                success: false,
                error: error.message,
              })
            )
          }
        } else {
          res.writeHead(405, { 'Content-Type': 'text/plain' })
          res.end('Method Not Allowed')
        }
      })

      console.log('')
      console.log('📌 Version Plugin Active:')
      console.log('   To regenerate version: POST http://localhost:5173/api/regenerate-version')
      console.log(
        '   Or use the browser console: fetch("/api/regenerate-version", {method: "POST"})'
      )
      console.log('')
    },
  }
}
