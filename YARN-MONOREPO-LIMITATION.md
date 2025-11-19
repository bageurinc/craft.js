# Yarn v1 Monorepo Limitation & Solutions

## 🚨 Problem: Yarn v1 Cannot Install from GitHub Monorepos

**Error when using GitHub dependency:**
```json
{
  "dependencies": {
    "@craftjs/core": "github:bageurinc/craft.js#v2.0.0"
  }
}
```

**Yarn error:**
```
error Can't add "@craftjs/core": invalid package version undefined.
```

Or with path suffix:
```json
"@craftjs/core": "github:bageurinc/craft.js#v2.0.0:packages/core"
```

**Yarn error:**
```
error Couldn't find match for "v2.0.0:packages/core" in "refs/heads/main,refs/tags/v2.0.0"
```

## 🔍 Root Cause

**Yarn Classic (v1.x)** has limited support for installing packages from GitHub monorepos. It cannot:
- Auto-detect packages in `packages/` directory
- Use path suffix syntax (`:packages/core`)
- Resolve workspace dependencies properly

**npm** also has issues because packages use `workspace:*` syntax which is Yarn-specific.

## ✅ Solutions

### Solution 1: Local Link (RECOMMENDED for Development)

**For development with local craft.js repository:**

```json
{
  "dependencies": {
    "@craftjs/core": "link:../craft.js/packages/core",
    "@craftjs/layers": "link:../craft.js/packages/layers"
  }
}
```

**Benefits:**
- ✅ Works perfectly with Yarn v1
- ✅ Changes to craft.js immediately reflected
- ✅ No need to rebuild/republish
- ✅ Fast development workflow

**Requirements:**
- craft.js repository must be at `../craft.js/` relative path
- Packages must be built (`yarn build` in craft.js)

**Install:**
```bash
cd /path/to/isi-page-fe
yarn install
```

### Solution 2: Upgrade to Yarn v3+ (Berry)

Yarn Modern (v3+) has better monorepo support:

```bash
# Enable Yarn Berry
yarn set version stable

# Update package.json to use GitHub
{
  "dependencies": {
    "@craftjs/core": "github:bageurinc/craft.js#v2.0.0"
  }
}

# Install
yarn install
```

**Benefits:**
- ✅ Native GitHub monorepo support
- ✅ Better workspace handling
- ✅ Modern features

**Drawbacks:**
- ⚠️ Different configuration format
- ⚠️ May need .yarnrc.yml setup
- ⚠️ Learning curve

### Solution 3: Switch to pnpm

pnpm has excellent monorepo support:

```bash
# Install pnpm
npm install -g pnpm

# Use GitHub dependencies
{
  "dependencies": {
    "@craftjs/core": "github:bageurinc/craft.js#v2.0.0"
  }
}

# Install
pnpm install
```

**Benefits:**
- ✅ Best monorepo support
- ✅ Faster installs
- ✅ Disk space efficient

**Drawbacks:**
- ⚠️ Need to install pnpm
- ⚠️ Different lock file format

### Solution 4: Publish to Private npm Registry

Publish packages to GitHub Package Registry or private npm:

```bash
# Publish to GitHub Packages
npm publish --registry=https://npm.pkg.github.com
```

Then install:
```json
{
  "dependencies": {
    "@craftjs/core": "2.0.0"
  }
}
```

**Benefits:**
- ✅ Works with all package managers
- ✅ Versioning control
- ✅ Production-ready

**Drawbacks:**
- ⚠️ Need to setup registry auth
- ⚠️ Extra publish step
- ⚠️ Costs (for private packages)

## 🎯 Recommended Workflow

### For Development (Local)

Use `link:` dependencies:

```json
{
  "dependencies": {
    "@craftjs/core": "link:../craft.js/packages/core",
    "@craftjs/layers": "link:../craft.js/packages/layers"
  }
}
```

**Workflow:**
```bash
# Terminal 1: Build craft.js on changes
cd /path/to/craft.js
yarn dev

# Terminal 2: Run isi-page-fe
cd /path/to/isi-page-fe
yarn dev
```

Or use the convenience script:
```bash
cd /path/to/isi-page-fe
yarn dev:craft  # Runs both craft.js build + dev server
```

### For Production/Deployment

**Option A: Continue using local link**

If deploying from same server with both repositories:
```bash
# Clone both repos
git clone git@github.com:bageurinc/craft.js.git
git clone git@github.com:bageurinc/isi-page-fe.git

# Build craft.js
cd craft.js && yarn build

# Build isi-page-fe
cd ../isi-page-fe && yarn install && yarn build
```

**Option B: Switch to pnpm**

Update to pnpm and use GitHub dependencies:
```bash
# Install pnpm
npm install -g pnpm

# Update package.json
{
  "dependencies": {
    "@craftjs/core": "github:bageurinc/craft.js#v2.0.0"
  }
}

# Install and build
pnpm install && pnpm build
```

**Option C: Publish to npm registry**

Publish craft.js to GitHub Packages and install from there.

## 📋 Comparison Table

| Method | Yarn v1 | npm | pnpm | Yarn v3+ | Dev Speed | Prod Ready |
|--------|---------|-----|------|----------|-----------|----------|
| `link:` | ✅ | ✅ | ✅ | ✅ | ⚡ Fast | ⚠️ Requires both repos |
| GitHub URL | ❌ | ⚠️ Issues | ✅ | ✅ | 🐢 Slow | ✅ Yes |
| npm Registry | ✅ | ✅ | ✅ | ✅ | 🐢 Slow | ✅ Yes |

## 🔧 Current Setup for isi-page-fe

**package.json:**
```json
{
  "dependencies": {
    "@craftjs/core": "link:../craft.js/packages/core",
    "@craftjs/layers": "link:../craft.js/packages/layers"
  }
}
```

**Directory structure:**
```
PROJECT/ISIPAGE/
├── craft.js/              # Craft.js fork
│   └── packages/
│       ├── core/
│       └── layers/
└── isi-page-fe/          # Admin dashboard
    └── package.json
```

**Development workflow:**
```bash
# Start both in parallel
cd isi-page-fe
yarn dev:craft

# Or manual
cd craft.js && yarn dev &
cd isi-page-fe && yarn dev
```

## 🚀 Quick Fix for Current Issue

If you encounter Yarn errors:

```bash
cd /path/to/isi-page-fe

# 1. Update package.json to use link:
# "@craftjs/core": "link:../craft.js/packages/core"
# "@craftjs/layers": "link:../craft.js/packages/layers"

# 2. Clear cache
yarn cache clean
rm -rf node_modules/@craftjs

# 3. Reinstall
yarn install

# 4. Build craft.js if not built
cd ../craft.js && yarn build

# 5. Verify link
ls -la node_modules/@craftjs/core  # Should be a symlink
```

## 📚 Additional Resources

- [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)
- [npm link](https://docs.npmjs.com/cli/v8/commands/npm-link)
- [pnpm Workspace](https://pnpm.io/workspaces)
- [Yarn Berry](https://yarnpkg.com/getting-started)

## 💡 Conclusion

For the current isi-page project:

**✅ Best Solution:** Keep using `link:` dependencies
- Works perfectly with Yarn v1
- Fast development workflow
- No migration needed
- Already setup and working

**Future Migration:** Consider pnpm or Yarn v3+ for better GitHub monorepo support when needed.
