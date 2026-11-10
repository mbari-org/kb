#!/usr/bin/env node
import { readFileSync } from 'fs'
import { existsSync } from 'fs'
import path from 'path'
import { SourceMap } from 'module'

const MAPS_DIR = path.resolve('dist/assets')

const usage = () => {
  console.log(`Usage:
  yarn map-trace <bundle-file> <line> <col>
  yarn map-trace '<pasted stack trace>'
  pbpaste | yarn map-trace

Maps minified frames (e.g. index-CxkNDCOW.js:40:1195) to original source
via the sourcemaps in dist/assets. dist/ must contain the build that
produced the error (checkout the commit from the Whoops version stamp,
then run 'yarn version:test-deploy' or 'yarn build').`)
}

const mapFrame = (file, line, col) => {
  const mapPath = path.join(MAPS_DIR, `${file}.map`)
  if (!existsSync(mapPath)) {
    return { file, line, col, error: `no sourcemap at ${mapPath}` }
  }
  const map = new SourceMap(JSON.parse(readFileSync(mapPath, 'utf8')))
  const entry = map.findEntry(line - 1, col)
  return { file, line, col, entry }
}

const formatResult = ({ file, line, col, entry, error }) => {
  if (error) {
    return `${file}:${line}:${col}  ->  ${error}`
  }
  if (!entry?.originalSource) {
    return `${file}:${line}:${col}  ->  (no mapping found)`
  }
  const name = entry.name ? ` [${entry.name}]` : ''
  return `${file}:${line}:${col}  ->  ${entry.originalSource}:${entry.originalLine + 1}:${entry.originalColumn + 1}${name}`
}

const frameRe = /([\w.-]+\.js):(\d+):(\d+)/g

const main = () => {
  const args = process.argv.slice(2)

  if (args.length === 3 && /^\d+$/.test(args[1]) && /^\d+$/.test(args[2])) {
    const [file, line, col] = args
    console.log(formatResult(mapFrame(file, Number(line), Number(col))))
    return
  }

  let text = args.join(' ')
  if (!text.trim() && !process.stdin.isTTY) {
    text = readFileSync(0, 'utf8')
  }

  if (!text.trim()) {
    usage()
    process.exit(1)
  }

  const matches = [...text.matchAll(frameRe)]
  if (matches.length === 0) {
    console.error('No frames matching <file>.js:<line>:<col> found in input.')
    process.exit(1)
  }

  for (const [, file, line, col] of matches) {
    console.log(formatResult(mapFrame(file, Number(line), Number(col))))
  }
}

main()
