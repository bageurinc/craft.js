# Craft.js Fork - Installation Guide

This guide explains how to install and use this forked version of Craft.js in your project.

## Table of Contents

- [Quick Start](#quick-start)
- [Installation Methods](#installation-methods)
- [Automated Installation](#automated-installation)
- [Manual Installation](#manual-installation)
- [Updating](#updating)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Quick Start

The fastest way to get started:

```bash
# In your isi-page-fe project
cd /path/to/isi-page-fe

# Install from GitHub (latest release)
npm install github:gin31259461/craft.js#latest

# Or install specific version
npm install github:gin31259461/craft.js#v1.0.0
```

## Installation Methods

### Method 1: Direct Git Dependency (Recommended)

This is the simplest method for private projects. No need to publish to npm.

#### Package Managers

**npm:**
```bash
npm install github:gin31259461/craft.js#v1.0.0
```

**Yarn:**
```bash
yarn add github:gin31259461/craft.js#v1.0.0
```

**pnpm:**
```bash
pnpm add github:gin31259461/craft.js#v1.0.0
```

#### Using Latest Release

```bash
npm install github:gin31259461/craft.js#latest
```

#### Your package.json will look like:

```json
{
  "dependencies": {
    "@craftjs/core": "github:gin31259461/craft.js#v1.0.0"
  }
}
```

### Method 2: Using Automated Scripts

This repository provides helper scripts to automate the installation process.

#### Update Consumer Project

```bash
# From craft.js repository root
cd /path/to/craft.js

# Update isi-page-fe to latest version
./scripts/update-consumer.sh

# Or update to specific tag
./scripts/update-consumer.sh v1.0.0
```

This script will:
1. ✅ Verify the tag exists
2. ✅ Update package.json with git dependency
3. ✅ Create backup (package.json.backup)
4. ✅ Install dependencies
5. ✅ Verify installation

#### Verify Installation

```bash
# From craft.js repository root
./scripts/verify-install.sh

# Or specify custom path
./scripts/verify-install.sh /path/to/consumer-project
```

This will check:
- ✅ package.json configuration
- ✅ node_modules installation
- ✅ Package imports
- ✅ Git repository status
- ✅ Package structure

## Manual Installation

### Step 1: Update package.json

Edit your `package.json`:

```json
{
  "dependencies": {
    "@craftjs/core": "github:gin31259461/craft.js#v1.0.0"
  }
}
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Verify Installation

```bash
# Check if package is installed
ls node_modules/@craftjs/core

# Test import
node -e "console.log(require('@craftjs/core'))"
```

## Updating

### Update to Latest Release

```bash
npm install github:gin31259461/craft.js#latest
```

### Update to Specific Version

```bash
npm install github:gin31259461/craft.js#v1.1.0
```

### Using Update Script

```bash
cd /path/to/craft.js
./scripts/update-consumer.sh v1.1.0
```

### Force Reinstall

```bash
# Remove and reinstall
rm -rf node_modules/@craftjs
npm install

# Or clear cache first
npm cache clean --force
rm -rf node_modules/@craftjs
npm install
```

## Version Tags

This fork uses semantic versioning:

- **v1.0.0** - Initial fork with improvements
- **v1.1.0** - Feature additions
- **v1.0.1** - Bug fixes
- **latest** - Always points to the most recent stable release

### Viewing Available Tags

```bash
git ls-remote --tags https://github.com/gin31259461/craft.js
```

Or on GitHub:
https://github.com/gin31259461/craft.js/tags

## Verification

### Quick Check

```bash
# From your project root
node -e "console.log(require('@craftjs/core/package.json').version)"
```

### Full Verification

```bash
# From craft.js repository
./scripts/verify-install.sh /path/to/your-project
```

### Manual Verification Steps

1. **Check package.json:**
   ```bash
   grep "@craftjs/core" package.json
   ```

2. **Check installed package:**
   ```bash
   ls -la node_modules/@craftjs/core
   ```

3. **Test import in Node:**
   ```bash
   node -e "const craft = require('@craftjs/core'); console.log('✓ Import successful')"
   ```

4. **Test in your app:**
   ```javascript
   import { useEditor } from '@craftjs/core';
   // Should work without errors
   ```

## Troubleshooting

### Issue: Package not found

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Git dependency not updating

**Solution:**
```bash
# Force reinstall specific package
npm install github:gin31259461/craft.js#v1.0.0 --force

# Or remove and reinstall
rm -rf node_modules/@craftjs
npm install
```

### Issue: Wrong version installed

**Solution:**
```bash
# Check installed version
npm list @craftjs/core

# Update to specific tag
npm install github:gin31259461/craft.js#v1.1.0

# Verify
npm list @craftjs/core
```

### Issue: Build errors

**Solution:**
```bash
# Clear all caches
npm cache clean --force
rm -rf node_modules
rm package-lock.json  # or yarn.lock / pnpm-lock.yaml

# Reinstall everything
npm install
```

### Issue: Import errors

**Possible causes:**
1. Package not built - check if `dist/` or `lib/` exists in `node_modules/@craftjs/core`
2. TypeScript errors - check your `tsconfig.json`
3. Module resolution - check your bundler config (Vite/Webpack)

**Solution:**
```bash
# Verify package structure
ls -la node_modules/@craftjs/core/

# Check for build outputs
ls -la node_modules/@craftjs/core/dist/

# If missing, the package may need to be rebuilt
cd node_modules/@craftjs/core
npm run build
cd ../..
```

## Advanced Usage

### Using Commit Hash Instead of Tag

```bash
npm install github:gin31259461/craft.js#abc1234
```

Where `abc1234` is the commit hash.

### Using Branch

```bash
npm install github:gin31259461/craft.js#main
npm install github:gin31259461/craft.js#develop
```

**⚠️ Warning:** Using branches means you'll get the latest code from that branch, which may be unstable.

### Lock to Specific Commit

For maximum stability in production:

```json
{
  "dependencies": {
    "@craftjs/core": "github:gin31259461/craft.js#a1b2c3d4e5f6"
  }
}
```

This ensures you always get the exact same code.

## CI/CD Considerations

### GitHub Actions

```yaml
- name: Install dependencies
  run: npm install
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Private Repository Access

If the Craft.js fork is private, you'll need authentication:

```bash
# Set up git credentials
git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"

# Then install
npm install
```

Or use `.npmrc`:

```
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Package Manager Differences

### npm
- Uses `package-lock.json`
- Cache: `~/.npm`
- Clear cache: `npm cache clean --force`

### Yarn
- Uses `yarn.lock`
- Cache: `~/.yarn/cache`
- Clear cache: `yarn cache clean`

### pnpm
- Uses `pnpm-lock.yaml`
- Cache: `~/.pnpm-store`
- Clear cache: `pnpm store prune`

## Best Practices

1. **Always use tagged versions** in production
2. **Lock dependencies** in package-lock.json
3. **Test after updates** before deploying
4. **Keep backups** of working package.json
5. **Document the version** you're using in your README

## Support

If you encounter issues:

1. Run the verification script: `./scripts/verify-install.sh`
2. Check the [Troubleshooting](#troubleshooting) section
3. Review the [PUBLISH-GUIDE.md](./PUBLISH-GUIDE.md) for publishing information
4. Open an issue on GitHub with:
   - Your package.json
   - Error messages
   - Output of `npm list @craftjs/core`
   - Node/npm versions

## See Also

- [PUBLISH-GUIDE.md](./PUBLISH-GUIDE.md) - How to create releases
- [README.md](./README.md) - Project overview
- [CHANGELOG.md](./CHANGELOG.md) - Version history
