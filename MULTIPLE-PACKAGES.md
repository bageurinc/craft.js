# Working with Multiple Packages (@craftjs/core & @craftjs/layers)

This guide explains how to publish and use **multiple packages** from this Craft.js monorepo fork.

## 📦 Available Packages

This repository contains **3 packages** in a monorepo structure:

1. **@craftjs/core** - Main page editor library (REQUIRED)
2. **@craftjs/layers** - Photoshop-like layers panel UI (OPTIONAL)
3. **@craftjs/utils** - Internal utilities (usually auto-installed as dependency)

## 🎯 Key Concept: Single Tag, Multiple Packages

**IMPORTANT:** When you create a git tag (e.g., `v1.0.0`), it applies to **ALL packages** in the monorepo!

```bash
# This single command publishes ALL packages
./scripts/release.sh 1.0.0 "Initial release"
```

All three packages will be available at:
- `github:gin31259461/craft.js#v1.0.0` (same tag for all!)

## 📥 Installation in isi-page-fe

Since isi-page-fe uses **BOTH** `@craftjs/core` and `@craftjs/layers`, you need to install both.

### Method 1: Automated Script (RECOMMENDED)

```bash
cd /Users/gin/Documents/PROJECT/ISIPAGE/craft.js

# This will update ALL @craftjs packages found in isi-page-fe
./scripts/update-consumer.sh v1.0.0
```

The script automatically detects and updates:
- ✅ @craftjs/core
- ✅ @craftjs/layers
- ✅ @craftjs/utils (if present)

### Method 2: Manual package.json Edit

Edit `isi-page-fe/package.json`:

```json
{
  "dependencies": {
    "@craftjs/core": "github:gin31259461/craft.js#v1.0.0",
    "@craftjs/layers": "github:gin31259461/craft.js#v1.0.0"
  }
}
```

**Note:** Both packages use the **same tag** because they're from the **same repository**!

Then install:

```bash
cd /Users/gin/Documents/PROJECT/ISIPAGE/isi-page-fe
npm install
```

### Method 3: Via npm Command

```bash
cd /Users/gin/Documents/PROJECT/ISIPAGE/isi-page-fe

# Install core package
npm install @craftjs/core@github:gin31259461/craft.js#v1.0.0

# Install layers package
npm install @craftjs/layers@github:gin31259461/craft.js#v1.0.0
```

## 🔄 How It Works

### Monorepo Structure

```
craft.js/
├── packages/
│   ├── core/          # @craftjs/core package
│   │   ├── package.json
│   │   └── src/
│   ├── layers/        # @craftjs/layers package
│   │   ├── package.json
│   │   └── src/
│   └── utils/         # @craftjs/utils package
│       ├── package.json
│       └── src/
└── lerna.json
```

### Git Tag Behavior

When npm installs from GitHub:

```bash
npm install @craftjs/core@github:gin31259461/craft.js#v1.0.0
```

It does:
1. Clone the repository at tag `v1.0.0`
2. Look for `packages/core/package.json`
3. Install that specific package

Same for layers:
```bash
npm install @craftjs/layers@github:gin31259461/craft.js#v1.0.0
```

1. Clone the repository at tag `v1.0.0` (same tag!)
2. Look for `packages/layers/package.json`
3. Install that specific package

## 📊 Version Synchronization

### All Packages Share the Same Git Tag

```bash
# Create v1.0.0 tag
./scripts/release.sh 1.0.0 "Initial release"
```

Results in:
- @craftjs/core → v1.0.0 (from git tag)
- @craftjs/layers → v1.0.0 (from git tag)
- @craftjs/utils → v1.0.0 (from git tag)

### Individual Package.json Versions

Each package has its own `version` in `package.json`:

```json
// packages/core/package.json
{ "version": "0.2.12" }

// packages/layers/package.json
{ "version": "0.2.7" }
```

**IMPORTANT:** When installing from GitHub, the git tag **overrides** these internal versions!

The installed version will be the **git tag** (e.g., `v1.0.0`), not the package.json version.

## 🚀 Publishing Workflow

### Step 1: Make Changes

Edit any packages you need:
```bash
cd /Users/gin/Documents/PROJECT/ISIPAGE/craft.js

# Edit core package
vim packages/core/src/...

# Edit layers package
vim packages/layers/src/...
```

### Step 2: Build All Packages

```bash
yarn build
```

This builds ALL packages in the monorepo.

### Step 3: Commit Changes

```bash
git add .
git commit -m "Add feature X to core and layers"
git push
```

### Step 4: Create Release Tag

```bash
# Single tag for ALL packages
./scripts/release.sh 1.1.0 "Add feature X"
```

### Step 5: Update Consumer

```bash
# Updates ALL @craftjs packages in isi-page-fe
./scripts/update-consumer.sh v1.1.0
```

## 📝 Example: Complete Workflow

```bash
# 1. Make changes to core and layers
cd /Users/gin/Documents/PROJECT/ISIPAGE/craft.js
vim packages/core/src/editor/Editor.tsx
vim packages/layers/src/layers/LayerPanel.tsx

# 2. Build
yarn build

# 3. Commit
git add .
git commit -m "Improve editor and layer panel"
git push

# 4. Create release (updates ALL packages)
./scripts/release.sh 1.2.0 "Improve editor and layer panel"

# 5. Update isi-page-fe (updates BOTH packages automatically)
./scripts/update-consumer.sh v1.2.0

# 6. Verify installation
./scripts/verify-install.sh
```

## ✅ Verification

### Check Installed Packages

```bash
cd /Users/gin/Documents/PROJECT/ISIPAGE/isi-page-fe

# Check core
npm list @craftjs/core

# Check layers
npm list @craftjs/layers

# Both should show: github:gin31259461/craft.js#v1.0.0
```

### Using Verify Script

```bash
cd /Users/gin/Documents/PROJECT/ISIPAGE/craft.js
./scripts/verify-install.sh
```

Output:
```
Testing @craftjs/core dependency...
✓ @craftjs/core found in dependencies
  → github:gin31259461/craft.js#v1.0.0

Testing @craftjs/layers dependency...
✓ @craftjs/layers found in dependencies
  → github:gin31259461/craft.js#v1.0.0

Testing node_modules...
✓ @craftjs/core installed in node_modules
✓ @craftjs/layers installed in node_modules
```

## 🔧 Advanced: Per-Package Versioning

If you want different versions for each package (NOT RECOMMENDED for this fork):

```json
{
  "dependencies": {
    // Using different commits for different packages
    "@craftjs/core": "github:gin31259461/craft.js#abc1234",
    "@craftjs/layers": "github:gin31259461/craft.js#def5678"
  }
}
```

**⚠️ Warning:** This can cause compatibility issues! Always use the same tag for all packages.

## 📋 Package Dependencies

### @craftjs/layers depends on @craftjs/core

In `packages/layers/package.json`:

```json
{
  "peerDependencies": {
    "@craftjs/core": ">=0.2.0"
  }
}
```

When you install:
```bash
npm install @craftjs/layers@github:gin31259461/craft.js#v1.0.0
```

npm will also install `@craftjs/core` if not present.

### @craftjs/core depends on @craftjs/utils

The `@craftjs/utils` package is usually auto-installed as a dependency.

## 🎯 Best Practices

### 1. Always Use Same Tag for All Packages

**✅ Good:**
```json
{
  "dependencies": {
    "@craftjs/core": "github:gin31259461/craft.js#v1.0.0",
    "@craftjs/layers": "github:gin31259461/craft.js#v1.0.0"
  }
}
```

**❌ Bad:**
```json
{
  "dependencies": {
    "@craftjs/core": "github:gin31259461/craft.js#v1.0.0",
    "@craftjs/layers": "github:gin31259461/craft.js#v1.1.0"  // Different tag!
  }
}
```

### 2. Use Automated Script

The script ensures consistency:

```bash
./scripts/update-consumer.sh v1.0.0
```

This updates **ALL** @craftjs packages to the **SAME** tag.

### 3. Test Before Deploying

```bash
cd /Users/gin/Documents/PROJECT/ISIPAGE/isi-page-fe
npm run build
# Check for errors
```

### 4. Document Changes

Update CHANGELOG.md with changes to **ALL** modified packages:

```markdown
## [1.1.0] - 2025-01-20

### @craftjs/core
- Added new feature X
- Fixed bug Y

### @craftjs/layers
- Improved layer panel UI
- Fixed drag-and-drop issue
```

## 🐛 Troubleshooting

### Packages showing different versions

**Problem:**
```bash
npm list @craftjs/core   # → v1.0.0
npm list @craftjs/layers # → v0.2.7
```

**Solution:**
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules/@craftjs
npm install

# Or use update script
cd /path/to/craft.js
./scripts/update-consumer.sh v1.0.0
```

### Peer dependency warnings

**Problem:**
```
npm WARN @craftjs/layers@1.0.0 requires @craftjs/core@>=0.2.0
```

**Solution:** Install both packages at the same tag:
```bash
npm install @craftjs/core@github:gin31259461/craft.js#v1.0.0
npm install @craftjs/layers@github:gin31259461/craft.js#v1.0.0
```

### One package not updating

**Problem:** Only @craftjs/core updated, @craftjs/layers still old version.

**Solution:**
```bash
# Force reinstall
npm install @craftjs/layers@github:gin31259461/craft.js#v1.0.0 --force
```

## 📚 Summary

| Action | Command |
|--------|---------|
| Publish all packages | `./scripts/release.sh 1.0.0 "Message"` |
| Install all packages | `./scripts/update-consumer.sh v1.0.0` |
| Install core only | `npm install @craftjs/core@github:gin31259461/craft.js#v1.0.0` |
| Install layers only | `npm install @craftjs/layers@github:gin31259461/craft.js#v1.0.0` |
| Verify installation | `./scripts/verify-install.sh` |
| Check versions | `npm list @craftjs/core @craftjs/layers` |

**Key Takeaway:** One git tag = All packages updated together! 🚀
