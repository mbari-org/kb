# Application Versioning

This React application uses an automated versioning system that generates date-based version strings in the format `YYYY.MM.DD-HHMM`.

## Overview

The versioning system automatically:

- Generates version strings based on the current date
- Captures git metadata (hash, branch, commit date/message)
- Creates a version file that can be imported by React components
- Integrates with the build process
- Provides detailed build and commit information

## Version Format

```
YYYY.MM.DD-HHMM
```

**Example:** `2025.06.15-1430`

- `YYYY.MM.DD`: Build date in calendar format
- `HHMM`: Build time in 24-hour local time

## Files

### Core Files

- `vite-plugins/version-plugin.js` - Version generation plugin
- `src/version.js` - Auto-generated version file
- `src/components/common/VersionDisplay.jsx` - React component for displaying version
- `scripts/generate-version.js` - Manual generator for `src/version.js`
- `scripts/release-version.js` - Release script that bumps `package.json` and tags

## Setup

Version generation is automatically integrated into Vite via a custom plugin. No additional setup is required.

### How It Works

- **Development**: Version is generated when Vite starts and can be refreshed via HMR
- **Production**: Version is generated during the build process
- **HMR Integration**: Changes are reflected without server restart
- **Package.json update**: `package.json` is updated only during the release script

## Usage

### Building the Application

Version generation is automatically included in build commands:

```bash
# Development
yarn dev

# Production build
yarn build
```

### Release Workflow (Script)

1. Commit changes normally during development.
2. Regenerate `src/version.js` as needed (optional): `yarn version:generate`.
3. On `main` with a clean working tree, run `yarn release:version`.
4. The release script updates `package.json`, commits with `v<version>`, and tags `main` with `<version>`.

### Hot Module Replacement (HMR) Support

In development mode, you can refresh the version without restarting the server:

**Method 1: Using the UI**

- Hover over the version display in the navigation
- Click the small refresh icon that appears

**Method 2: Using Browser Console**

```javascript
fetch('/api/regenerate-version', { method: 'POST' })
```

**Method 3: Using curl**

```bash
curl -X POST http://localhost:5173/api/regenerate-version
```

The version will update immediately in the UI via HMR, reflecting your latest commits without needing to restart the development server.

### Using in React Components

#### Import Version Functions

```javascript
import { getVersion, getBuildDate, getCommitHash, getBranchName } from '@/version'

function MyComponent() {
  const version = getVersion() // "2025.06.15-1430"
  const buildDate = getBuildDate() // "2025-06-15T11:02:01.803Z"
  const commitHash = getCommitHash() // "af28b01"
  const branchName = getBranchName() // "main"

  return <div>Version: {version}</div>
}
```

#### Using the VersionDisplay Component

```javascript
import VersionDisplay from '@/components/common/VersionDisplay';

// Text display (default)
<VersionDisplay />

// Icon display (shows information icon with tooltip)
<VersionDisplay display="icon" />

// Custom styling
<VersionDisplay
  variant="h6"
  color="primary.main"
/>
```

#### Display Modes

1. **Text** (default): Shows version text with hover refresh button in development
2. **Icon**: Shows an information icon that always displays the version tooltip

#### Automatic Tooltip Behavior

The `VersionDisplay` component automatically shows a detailed tooltip when:

- Running in **development mode** (for any display mode)
- Display mode is **icon** (always shows tooltip in production too)

The tooltip contains:

- Version string
- Commit date and hash
- Build date
- Current branch
- Working directory status (if dirty)

This provides development teams with detailed version information during development, while keeping the production UI clean unless specifically using icon mode.

## Version Information Available

The generated version file contains:

```javascript
{
  version: "2025.06.15-1430",             // Main version string
  buildDate: "2025-06-15T11:02:01.803Z", // ISO timestamp of build
  commitHash: "af28b01",                // Short git commit hash
  branchName: "main",                   // Git branch name
  commitDate: "2025-06-13 14:47:45 +0200", // Git commit timestamp
  commitMessage: "Fix login form",      // First line of commit message
  isDirty: false                        // Whether working directory had uncommitted changes
}
```

## Working Directory Status

The system detects if the working directory has uncommitted changes:

- `isDirty: true` - Working directory has uncommitted changes
- `isDirty: false` - Working directory is clean

This information is displayed in the UI with a warning indicator when changes are present.

## Customization

### Modifying Version Format

Edit `vite-plugins/version-plugin.js` and modify `dateString` and how `versionInfo.version` is set:

```javascript
// Current format: YYYY.MM.DD-HHMM
const version = `${dateString}`

// Example alternative: v1.0.0-YYYYMMDD-commitHash
const version = `v1.0.0-${year}${month}${day}-${commitHash}`
```

### Adding New Version Information

Extend the `versionInfo` object in the plugin:

```javascript
const versionInfo = {
  version: `${dateString}`,
  buildDate: now.toISOString(),
  commitHash: commitHash,
  branchName: branchName,
  commitDate: commitDate,
  commitMessage: commitMessage,
  isDirty: !isWorkingDirClean,
  // Add custom fields
  buildNumber: process.env.BUILD_NUMBER || 'local',
  environment: process.env.NODE_ENV || 'development',
}
```

### Styling the VersionDisplay Component

The component accepts all Material-UI Typography props and additional styling:

```javascript
<VersionDisplay variant='body2' color='text.primary' sx={{ fontWeight: 'bold' }} />
```

## Troubleshooting

### Version Shows "unknown"

This occurs when:

- Git is not available
- The directory is not a git repository
- Git commands fail

The system will gracefully fall back to "unknown" values.

### Build Fails During Version Generation

Make sure `git` is available in the build environment and that the repo has history. The plugin calls git to resolve commit metadata.

## Integration Examples

### In Footer

```javascript
function AppFooter() {
  return (
    <Box component='footer' sx={{ p: 2, textAlign: 'center' }}>
      <VersionDisplay />
    </Box>
  )
}
```

### In About Dialog

```javascript
function AboutDialog() {
  return (
    <Dialog open={open}>
      <DialogContent>
        <Typography variant='h6'>MBARI VARS KnowledgeBase</Typography>
        <VersionDisplay display='icon' variant='body2' />
        <Typography variant='caption'>Click the icon for version details</Typography>
      </DialogContent>
    </Dialog>
  )
}
```

### In Navigation Bar

```javascript
function NavBar() {
  return (
    <AppBar>
      <Toolbar>
        {/* Other nav items */}
        <Box sx={{ flexGrow: 1 }} />
        <VersionDisplay />
      </Toolbar>
    </AppBar>
  )
}
```
