# Publishing Craft.js Fork - Complete Guide

Ada 3 cara untuk publish dan menggunakan fork Craft.js Anda dalam production:

## 📋 Pilihan Publishing

### Option 1: GitHub Packages (Recommended - Private & Free)
✅ **Best for**: Private projects, team collaboration
✅ **Cost**: FREE
✅ **Control**: Full control, private registry
❌ **Requires**: GitHub authentication untuk install

### Option 2: npm Public Registry (Scoped Package)
✅ **Best for**: Public sharing, no auth needed
✅ **Easy**: Paling mudah digunakan
❌ **Cost**: Free for public, $7/month for private
❌ **Name**: Perlu nama scope berbeda (e.g., `@yourusername/craftjs-core`)

### Option 3: Git Repository Direct Install
✅ **Best for**: Quick solution, no publishing
✅ **Free**: Completely free
❌ **Slower**: Install lebih lambat (full git clone)
❌ **No versioning**: Harus pakai branch/tag untuk versioning

---

## 🚀 Option 1: GitHub Packages (RECOMMENDED)

### Kenapa Recommended?
- ✅ Private & secure
- ✅ Free untuk private repos
- ✅ Proper versioning dengan npm
- ✅ Built-in GitHub integration

### Steps:

#### 1. Update package.json untuk GitHub Packages

Untuk setiap package yang ingin di-publish:

**craft.js/packages/core/package.json:**
```json
{
  "name": "@YOUR_GITHUB_USERNAME/craftjs-core",
  "version": "0.2.13",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_GITHUB_USERNAME/craft.js.git"
  }
}
```

**craft.js/packages/layers/package.json:**
```json
{
  "name": "@YOUR_GITHUB_USERNAME/craftjs-layers",
  "version": "0.2.8",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_GITHUB_USERNAME/craft.js.git"
  },
  "dependencies": {
    "@YOUR_GITHUB_USERNAME/craftjs-utils": "^0.2.5",
    "react-contenteditable": "^3.3.3"
  },
  "peerDependencies": {
    "@YOUR_GITHUB_USERNAME/craftjs-core": ">=0.2.0",
    "react": "^16.8.0 || ^17 || ^18 || ^19",
    "styled-components": ">= 6.1"
  }
}
```

**craft.js/packages/utils/package.json:**
```json
{
  "name": "@YOUR_GITHUB_USERNAME/craftjs-utils",
  "version": "0.2.6",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_GITHUB_USERNAME/craft.js.git"
  }
}
```

#### 2. Create GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Select scopes:
   - ✅ `write:packages`
   - ✅ `read:packages`
   - ✅ `delete:packages` (optional)
4. Copy token (you won't see it again!)

#### 3. Authenticate npm with GitHub

```bash
# Login to GitHub Packages
npm login --registry=https://npm.pkg.github.com

# When prompted:
# Username: YOUR_GITHUB_USERNAME
# Password: YOUR_GITHUB_TOKEN (paste token dari step 2)
# Email: your-email@example.com
```

Atau buat `.npmrc` file:

```bash
# Create .npmrc in home directory
cat > ~/.npmrc << 'EOF'
@YOUR_GITHUB_USERNAME:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
EOF
```

#### 4. Build & Publish

```bash
cd /Users/gin/Documents/PROJECT/ISIPAGE/craft.js

# Build all packages
yarn build

# Publish utils first (no dependencies)
cd packages/utils
npm publish

# Publish core (depends on utils)
cd ../core
npm publish

# Publish layers (depends on core and utils)
cd ../layers
npm publish
```

#### 5. Install in isi-page-fe

Update `isi-page-fe/.npmrc`:
```
@YOUR_GITHUB_USERNAME:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Update `isi-page-fe/package.json`:
```json
{
  "dependencies": {
    "@YOUR_GITHUB_USERNAME/craftjs-core": "^0.2.13",
    "@YOUR_GITHUB_USERNAME/craftjs-layers": "^0.2.8"
  }
}
```

Remove resolutions:
```json
{
  "resolutions": {}  // Remove the local link resolutions
}
```

Install:
```bash
cd isi-page-fe
yarn install
```

---

## 🌐 Option 2: npm Public Registry

### Steps:

#### 1. Create npm Account

```bash
npm login
# Enter your npm credentials
```

#### 2. Update package.json

**packages/core/package.json:**
```json
{
  "name": "@YOUR_NPM_USERNAME/craftjs-core",
  "version": "0.2.13"
}
```

**packages/layers/package.json:**
```json
{
  "name": "@YOUR_NPM_USERNAME/craftjs-layers",
  "version": "0.2.8",
  "dependencies": {
    "@YOUR_NPM_USERNAME/craftjs-utils": "^0.2.5"
  },
  "peerDependencies": {
    "@YOUR_NPM_USERNAME/craftjs-core": ">=0.2.0"
  }
}
```

#### 3. Publish

```bash
cd craft.js

# Publish utils
cd packages/utils
npm publish --access public

# Publish core
cd ../core
npm publish --access public

# Publish layers
cd ../layers
npm publish --access public
```

#### 4. Install in isi-page-fe

```bash
cd isi-page-fe

# Update package.json
yarn add @YOUR_NPM_USERNAME/craftjs-core@^0.2.13
yarn add @YOUR_NPM_USERNAME/craftjs-layers@^0.2.8
```

---

## 📦 Option 3: Direct Git Install (Quick & Easy)

### Pros:
- ✅ No publishing needed
- ✅ No authentication setup
- ✅ Works immediately

### Cons:
- ❌ Slower installs
- ❌ Must commit to git first

### Steps:

#### 1. Push Fork to GitHub

```bash
cd /Users/gin/Documents/PROJECT/ISIPAGE/craft.js

# Make sure all changes are committed
git add .
git commit -m "feat(layers): Add dark mode support"
git push
```

#### 2. Create Git Tag for Version

```bash
# Create a tag for this version
git tag v0.2.13-darkmode
git push origin v0.2.13-darkmode
```

#### 3. Update isi-page-fe package.json

```json
{
  "dependencies": {
    "@craftjs/core": "git+https://github.com/YOUR_USERNAME/craft.js.git#v0.2.13-darkmode:packages/core",
    "@craftjs/layers": "git+https://github.com/YOUR_USERNAME/craft.js.git#v0.2.13-darkmode:packages/layers"
  }
}
```

Remove resolutions:
```json
{
  "resolutions": {}  // Remove local links
}
```

#### 4. Install

```bash
cd isi-page-fe
yarn install
```

---

## 🎯 Recommended Workflow

### For Development (Current):
✅ Keep using local links via `resolutions`

```json
{
  "resolutions": {
    "@craftjs/core": "link:../craft.js/packages/core",
    "@craftjs/layers": "link:../craft.js/packages/layers"
  }
}
```

### For Production/Deployment:

**Best Choice: GitHub Packages**

1. Publish to GitHub Packages (private, free)
2. Update CI/CD with GitHub token
3. Team members authenticate once

**Alternative: Git Direct Install**

If you don't want to setup publishing yet:
1. Use git tags
2. Reference specific tags in package.json
3. Works in Docker/CI (slower but functional)

---

## 🔄 Version Management

### Bumping Versions

Use Lerna for synchronized versioning:

```bash
cd craft.js

# Interactive version bump
yarn changeset

# Follow prompts to document changes

# Version packages (updates package.json)
yarn changeset version

# Build
yarn build

# Publish (if using npm/GitHub packages)
# For GitHub Packages:
cd packages/utils && npm publish
cd ../core && npm publish
cd ../layers && npm publish

# Commit version changes
git add .
git commit -m "chore: version packages"
git push

# Tag the release
git tag v0.2.13-darkmode
git push origin v0.2.13-darkmode
```

---

## 📝 CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Packages

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@YOUR_GITHUB_USERNAME'

      - run: yarn install
      - run: yarn build

      - name: Publish packages
        run: |
          cd packages/utils && npm publish
          cd ../core && npm publish
          cd ../layers && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🐳 Docker Deployment

### Using GitHub Packages in Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock .npmrc ./

# Install dependencies (will use GitHub Packages)
RUN yarn install --frozen-lockfile

# Copy app
COPY . .

# Build
RUN yarn build

CMD ["yarn", "start"]
```

**Build with secrets:**
```bash
docker build \
  --secret id=npmrc,src=$HOME/.npmrc \
  -t isi-page-fe .
```

### Using Git Direct Install in Docker

No special setup needed - works out of the box:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

CMD ["yarn", "start"]
```

---

## 🔍 Troubleshooting

### GitHub Packages: 401 Unauthorized

```bash
# Check authentication
npm whoami --registry=https://npm.pkg.github.com

# Re-authenticate
npm login --registry=https://npm.pkg.github.com
```

### Git Install: Slow/Timeout

```bash
# Use shallow clone
yarn add "git+https://github.com/YOUR_USERNAME/craft.js.git#v0.2.13-darkmode:packages/core" --depth 1
```

### Version Conflicts

```bash
# Clear cache
yarn cache clean
rm -rf node_modules
yarn install
```

---

## ✅ Recommendation

**For your use case (isi-page-fe + craft.js fork):**

1. **Development**: Keep using local links (current setup)
2. **Production**: Use **GitHub Packages** (private, free, proper versioning)

**Quick start:**
```bash
# 1. Update package names in craft.js
# 2. Build & publish to GitHub Packages
# 3. Update isi-page-fe to use GitHub Packages
# 4. Configure CI/CD with GitHub token
```

**OR if you want quick solution:**

Use **Git Direct Install** with tags - works immediately, no setup needed!

---

Need help with any specific option? Let me know! 🚀
