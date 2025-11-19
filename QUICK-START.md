# Quick Start Guide

This is a quick reference for common tasks with this Craft.js fork.

## Installation

### Install in isi-page-fe

```bash
cd /path/to/isi-page-fe
npm install github:gin31259461/craft.js#latest
```

### Using Automated Script

```bash
cd /path/to/craft.js
./scripts/update-consumer.sh
```

## Creating a New Release

### Interactive (Recommended)

```bash
./scripts/release.sh
```

The script will:
1. Show current version
2. Ask for new version number
3. Ask for release message
4. Create and push git tag

### Non-Interactive

```bash
./scripts/release.sh 1.0.1 "Bug fixes"
```

## Updating isi-page-fe

### Method 1: Automated Script

```bash
cd /path/to/craft.js
./scripts/update-consumer.sh v1.0.1
```

### Method 2: Manual

```bash
cd /path/to/isi-page-fe

# Update package.json
npm install github:gin31259461/craft.js#v1.0.1

# Or edit package.json manually:
# "@craftjs/core": "github:gin31259461/craft.js#v1.0.1"

npm install
```

## Verifying Installation

### Quick Check

```bash
cd /path/to/isi-page-fe
node -e "console.log(require('@craftjs/core/package.json').version)"
```

### Full Verification

```bash
cd /path/to/craft.js
./scripts/verify-install.sh
```

## Common Commands

### Development

```bash
# Build packages
yarn build

# Development mode (watch)
yarn dev

# Run tests
yarn test

# Lint code
yarn lint
```

### Version Management

```bash
# List all tags
git tag -l

# Show latest tag
git describe --tags --abbrev=0

# View tag details
git show v1.0.0
```

### Package Management

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install

# Force reinstall specific package
npm install github:gin31259461/craft.js#v1.0.0 --force
```

## Troubleshooting

### Package not updating

```bash
rm -rf node_modules/@craftjs
npm install
```

### Build errors in isi-page-fe

```bash
# Clear all caches
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Git tag already exists

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push --delete origin v1.0.0

# Create new tag
./scripts/release.sh 1.0.0 "Message"
```

## File Structure

```
craft.js/
├── scripts/
│   ├── release.sh         # Create releases
│   ├── update-consumer.sh # Update isi-page-fe
│   └── verify-install.sh  # Verify installation
├── packages/
│   └── core/             # Main @craftjs/core package
├── INSTALLATION.md       # Detailed installation guide
├── PUBLISH-GUIDE.md      # Detailed publishing guide
└── CHANGELOG.md          # Version history
```

## Version Naming

Follow [Semantic Versioning](https://semver.org/):

- **1.0.0** → **1.0.1** - Bug fixes (PATCH)
- **1.0.0** → **1.1.0** - New features (MINOR)
- **1.0.0** → **2.0.0** - Breaking changes (MAJOR)

## Quick Reference

| Task | Command |
|------|---------|
| Install in project | `npm install github:gin31259461/craft.js#latest` |
| Create release | `./scripts/release.sh` |
| Update consumer | `./scripts/update-consumer.sh` |
| Verify install | `./scripts/verify-install.sh` |
| Build packages | `yarn build` |
| Development mode | `yarn dev` |
| Run tests | `yarn test` |
| Check version | `git describe --tags --abbrev=0` |

## Next Steps

- Read [INSTALLATION.md](./INSTALLATION.md) for detailed installation instructions
- Read [PUBLISH-GUIDE.md](./PUBLISH-GUIDE.md) for complete publishing workflow
- Check [CHANGELOG.md](./CHANGELOG.md) for version history
- See [CLAUDE.md](./CLAUDE.md) for development documentation

## Support

**Installation Issues**: See [INSTALLATION.md](./INSTALLATION.md#troubleshooting)
**Release Issues**: See [PUBLISH-GUIDE.md](./PUBLISH-GUIDE.md#troubleshooting)
**Bug Reports**: Open issue on [GitHub](https://github.com/gin31259461/craft.js/issues)
