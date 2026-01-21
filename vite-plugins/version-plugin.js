import { execSync } from 'child_process'
import path from 'path'
import { pathToFileURL } from 'url'

/**
 * Vite plugin for automatic version generation with HMR support
 *
 * Single source of truth: scripts/generate-version.js
 */
export const versionPlugin = () => {
  let server
  let pendingWatchFile

  const versionFilePath = path.resolve('src/version.js')

  const runGenerateScript = () => {
    // Delegate version generation to the shared script
    execSync('node scripts/generate-version.js', {
      stdio: 'inherit',
      encoding: 'utf8',
    })
  }

  const loadVersionInfo = async () => {
    const versionUrl = `${pathToFileURL(versionFilePath).href}?t=${Date.now()}`
    const { VERSION_INFO } = await import(versionUrl)
    return VERSION_INFO
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

    buildStart: async () => {
      runGenerateScript()
      const versionInfo = await loadVersionInfo()
      const gitTag = getExactGitTag()

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
        server.watcher.add(versionFilePath)
      } else {
        pendingWatchFile = versionFilePath
      }
    },

    configureServer: viteServer => {
      server = viteServer
      if (pendingWatchFile) {
        server.watcher.add(pendingWatchFile)
        pendingWatchFile = undefined
      }

      server.middlewares.use('/api/regenerate-version', async (req, res) => {
        if (req.method === 'POST') {
          try {
            runGenerateScript()
            const versionInfo = await loadVersionInfo()
            const gitTag = getExactGitTag()

            // Trigger HMR for the version file
            const module = server.moduleGraph.getModuleById(versionFilePath)
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
