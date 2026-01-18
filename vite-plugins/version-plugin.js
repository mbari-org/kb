import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

/**
 * Vite plugin for automatic version generation with HMR support
 */
export const versionPlugin = () => {
  let server
  let pendingWatchFile

  const generateVersionInfo = () => {
    try {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const dateString = `${year}.${month}.${day}`

      const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
      const branchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
      const commitDate = execSync('git show -s --format=%ci HEAD', { encoding: 'utf8' }).trim()

      // first line of commit message
      const commitMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf8' })
        .trim()
        .split('\n')
        .pop()

      const isWorkingDirClean =
        execSync('git status --porcelain', { encoding: 'utf8' }).trim() === ''

      const versionInfo = {
        branchName: branchName,
        buildDate: now.toISOString(),
        commitDate: commitDate,
        commitHash: commitHash,
        commitMessage: commitMessage,
        isDirty: !isWorkingDirClean,
        version: dateString,
      }

      return versionInfo
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

  const writePackageJsonVersion = version => {
    const packageJsonPath = path.resolve('package.json')
    const rawPackageJson = fs.readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(rawPackageJson)

    packageJson.version = version
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
    return packageJsonPath
  }

  const getExactGitTag = () => {
    try {
      return execSync('git describe --tags --exact-match', { encoding: 'utf8' }).trim()
    } catch {
      return null
    }
  }

  return {
    name: 'version-plugin',

    buildStart: () => {
      const versionInfo = generateVersionInfo()
      const filePath = writeVersionFile(versionInfo)
      const gitTag = getExactGitTag()
      if (gitTag) {
        writePackageJsonVersion(versionInfo.version)
      }

      console.log(`✅ Version generated: ${versionInfo.version}`)
      console.log(`   Commit: ${versionInfo.commitHash}`)
      console.log(`   Date: ${versionInfo.commitDate}`)
      console.log(`   Message: ${versionInfo.commitMessage}`)
      console.log(`   Build: ${versionInfo.buildDate}`)
      console.log(`   Branch: ${versionInfo.branchName}`)
      console.log(`   Tag: ${gitTag || 'none'}`)
      console.log(`   Working dir clean: ${!versionInfo.isDirty}`)

      // Add the version file to Vite's watch list in dev mode
      if (server?.watcher) {
        server.watcher.add(filePath)
      } else {
        pendingWatchFile = filePath
      }
    },

    configureServer: viteServer => {
      server = viteServer
      if (pendingWatchFile) {
        server.watcher.add(pendingWatchFile)
        pendingWatchFile = undefined
      }

      server.middlewares.use('/api/regenerate-version', (req, res) => {
        if (req.method === 'POST') {
          try {
            const versionInfo = generateVersionInfo()
            const filePath = writeVersionFile(versionInfo)
            const gitTag = getExactGitTag()
            if (gitTag) {
              writePackageJsonVersion(versionInfo.version)
            }

            // Trigger HMR for the version file
            const module = server.moduleGraph.getModuleById(filePath)
            if (module) {
              server.reloadModule(module)
            }

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(
              JSON.stringify({
                success: true,
                version: `${versionInfo.version}`,
                tag: gitTag,
                message: 'Version regenerated successfully',
              })
            )

            console.log(`🔄 Version regenerated: ${versionInfo.version} (${versionInfo.commitHash})`)
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
