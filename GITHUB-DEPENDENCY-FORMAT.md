# GitHub Dependency Format - Correct Usage

This guide explains the **correct format** for installing packages from this Craft.js monorepo fork via GitHub.

## ❌ WRONG Format (Will Fail!)

```json
{
  "dependencies": {
    "@craftjs/core": "github:gin31259461/craft.js#v1.0.0:packages/core",
    "@craftjs/layers": "github:gin31259461/craft.js#v1.0.0:packages/layers"
  }
}
```

**Error:**
```
error Couldn't find match for "v1.0.0:packages/core" in "refs/heads/main,refs/tags/v1.0.0"
```

The `:packages/core` suffix is **NOT supported** by npm/yarn for GitHub dependencies.

## ✅ CORRECT Format

```json
{
  "dependencies": {
    "@craftjs/core": "github:gin31259461/craft.js#v1.0.0",
    "@craftjs/layers": "github:gin31259461/craft.js#v1.0.0"
  }
}
```

## 🔍 How It Works

### Monorepo Auto-Detection

When you install:
```bash
npm install @craftjs/core@github:gin31259461/craft.js#v1.0.0
```

npm/yarn will:

1. **Clone repository** at tag `v1.0.0`
2. **Scan for packages** in `packages/` directory
3. **Match by package name** in each `package.json`:
   ```json
   // packages/core/package.json
   { "name": "@craftjs/core" }
   ```
4. **Install that package**

### Multiple Packages from Same Repo

For monorepos with multiple packages:

```json
{
  "dependencies": {
    "@craftjs/core": "github:gin31259461/craft.js#v1.0.0",
    "@craftjs/layers": "github:gin31259461/craft.js#v1.0.0",
    "@craftjs/utils": "github:gin31259461/craft.js#v1.0.0"
  }
}
```

All use the **same repository URL** and **same tag**, but npm/yarn installs different packages based on the `name` field in each package's `package.json`.

## 📋 Format Breakdown

### Basic Format

```
github:<owner>/<repo>#<ref>
```

Where:
- `<owner>` = GitHub username (e.g., `gin31259461`)
- `<repo>` = Repository name (e.g., `craft.js`)
- `<ref>` = Git reference (tag, branch, or commit)

### Examples

```json
{
  "dependencies": {
    // Using git tag (RECOMMENDED)
    "@craftjs/core": "github:gin31259461/craft.js#v1.0.0",

    // Using latest tag
    "@craftjs/core": "github:gin31259461/craft.js#latest",

    // Using branch (for development)
    "@craftjs/core": "github:gin31259461/craft.js#main",

    // Using commit hash
    "@craftjs/core": "github:gin31259461/craft.js#a1b2c3d4e5f6"
  }
}
```

## 🚫 Common Mistakes

### 1. Adding Path Suffix

**❌ Wrong:**
```json
"@craftjs/core": "github:gin31259461/craft.js#v1.0.0:packages/core"
```

**✅ Correct:**
```json
"@craftjs/core": "github:gin31259461/craft.js#v1.0.0"
```

### 2. Wrong Repository Name

**❌ Wrong:**
```json
"@craftjs/core": "github:bageurinc/craft.js#v1.0.0"
```

**✅ Correct:**
```json
"@craftjs/core": "github:gin31259461/craft.js#v1.0.0"
```

### 3. Missing Tag Prefix

**⚠️ Ambiguous:**
```json
"@craftjs/core": "github:gin31259461/craft.js#1.0.0"
```

**✅ Better:**
```json
"@craftjs/core": "github:gin31259461/craft.js#v1.0.0"
```

(Both work, but `v` prefix is clearer it's a tag, not a branch)

### 4. Using Different Tags for Same Repo

**❌ Bad Practice:**
```json
{
  "@craftjs/core": "github:gin31259461/craft.js#v1.0.0",
  "@craftjs/layers": "github:gin31259461/craft.js#v1.1.0"  // Different tag!
}
```

**✅ Good Practice:**
```json
{
  "@craftjs/core": "github:gin31259461/craft.js#v1.0.0",
  "@craftjs/layers": "github:gin31259461/craft.js#v1.0.0"  // Same tag
}
```

## 🔧 Package Manager Differences

### npm

```bash
npm install @craftjs/core@github:gin31259461/craft.js#v1.0.0
```

Result in `package.json`:
```json
"@craftjs/core": "github:gin31259461/craft.js#v1.0.0"
```

### Yarn v1

```bash
yarn add @craftjs/core@github:gin31259461/craft.js#v1.0.0
```

Result in `package.json`:
```json
"@craftjs/core": "github:gin31259461/craft.js#v1.0.0"
```

### pnpm

```bash
pnpm add @craftjs/core@github:gin31259461/craft.js#v1.0.0
```

Result in `package.json`:
```json
"@craftjs/core": "github:gin31259461/craft.js#v1.0.0"
```

All use the **same format**!

## 📦 How Monorepo Detection Works

### Repository Structure

```
craft.js/
├── package.json              # Root package
├── packages/
│   ├── core/
│   │   ├── package.json      # { "name": "@craftjs/core" }
│   │   └── src/
│   ├── layers/
│   │   ├── package.json      # { "name": "@craftjs/layers" }
│   │   └── src/
│   └── utils/
│       ├── package.json      # { "name": "@craftjs/utils" }
│       └── src/
└── lerna.json                # Monorepo config
```

### Installation Flow

When you run:
```bash
npm install @craftjs/core@github:gin31259461/craft.js#v1.0.0
```

npm does:
1. Clone repo to temp location
2. Check root `package.json` - not matching? Continue
3. Look for `workspaces` or Lerna config
4. Scan `packages/*/package.json`
5. Find `packages/core/package.json` with `"name": "@craftjs/core"`
6. Install that package

### How It Knows Which Package

The `name` field in each package's `package.json` is the key:

```json
// packages/core/package.json
{
  "name": "@craftjs/core",  // ← This matches @craftjs/core
  "version": "0.2.12"
}

// packages/layers/package.json
{
  "name": "@craftjs/layers",  // ← This matches @craftjs/layers
  "version": "0.2.7"
}
```

## 🎯 Best Practices

### 1. Always Use Tagged Versions in Production

**✅ Production:**
```json
"@craftjs/core": "github:gin31259461/craft.js#v1.0.0"
```

**⚠️ Development Only:**
```json
"@craftjs/core": "github:gin31259461/craft.js#main"
```

### 2. Use Same Tag for All Packages from Same Repo

```json
{
  "@craftjs/core": "github:gin31259461/craft.js#v1.0.0",
  "@craftjs/layers": "github:gin31259461/craft.js#v1.0.0"
}
```

### 3. Update All Packages Together

```bash
# Use the update script
./scripts/update-consumer.sh v1.1.0

# This updates ALL @craftjs packages to v1.1.0
```

### 4. Lock Dependencies

Always commit `package-lock.json` (npm) or `yarn.lock` (yarn) to ensure consistent installs.

## 🐛 Troubleshooting

### Error: "Couldn't find match for..."

**Full error:**
```
error Couldn't find match for "v1.0.0:packages/core"
```

**Solution:** Remove the path suffix:
```json
// Change from:
"@craftjs/core": "github:gin31259461/craft.js#v1.0.0:packages/core"

// To:
"@craftjs/core": "github:gin31259461/craft.js#v1.0.0"
```

### Error: "Couldn't find package"

**Possible causes:**
1. Tag doesn't exist
2. Repository is private and no access token
3. Wrong repository name
4. Package name doesn't match any in the repo

**Solution:**
```bash
# Verify tag exists
git ls-remote --tags https://github.com/gin31259461/craft.js

# Check package name in repo
curl https://raw.githubusercontent.com/gin31259461/craft.js/v1.0.0/packages/core/package.json | grep name
```

### Package Not Updating

**Solution:**
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules/@craftjs
npm install
```

## 📚 References

- [npm git documentation](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#git-urls-as-dependencies)
- [Yarn git dependencies](https://classic.yarnpkg.com/en/docs/cli/add#toc-adding-dependencies)
- [pnpm git dependencies](https://pnpm.io/git)

## 📝 Summary

| ✅ Correct | ❌ Wrong |
|-----------|---------|
| `github:gin31259461/craft.js#v1.0.0` | `github:gin31259461/craft.js#v1.0.0:packages/core` |
| Same tag for all packages | Different tags per package |
| Use tagged versions | Use branch in production |
| Commit lock files | Ignore lock files |

**Remember:** npm/yarn auto-detects packages in monorepos. You don't need to specify the path! 🚀
