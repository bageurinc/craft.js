# Install Craft.js dari GitHub (Bageur Fork)

Panduan lengkap untuk menggunakan craft.js versi Bageur di project lain (seperti isi-page-fe).

## Quick Start

### 1. Install di Project Anda

```bash
# Di project isi-page-fe
cd isi-page-fe

# Install @craftjs/core
yarn add @craftjs/core@github:bageurinc/craft.js#v0.2.12-bageur

# Install @craftjs/layers (optional)
yarn add @craftjs/layers@github:bageurinc/craft.js#v0.2.12-bageur
```

### 2. Atau Edit package.json Langsung

```json
{
  "dependencies": {
    "@craftjs/core": "github:bageurinc/craft.js#v0.2.12-bageur",
    "@craftjs/layers": "github:bageurinc/craft.js#v0.2.12-bageur"
  }
}
```

Kemudian jalankan:
```bash
yarn install
```

### 3. Import dan Gunakan

```jsx
import { Editor, Frame, Element } from '@craftjs/core';

function App() {
  return (
    <Editor resolver={{}}>
      <Frame>
        {/* Your components */}
      </Frame>
    </Editor>
  );
}
```

## Membuat Tag Baru (untuk Maintainer)

### Otomatis dengan Script

```bash
# Di repository craft.js
./scripts/create-tag.sh v0.2.13-bageur
```

Script ini akan:
1. ✅ Check git status (harus clean)
2. 🏗️ Build semua packages
3. 🧪 Run tests
4. 📝 Create git tag
5. 📤 Push ke GitHub

### Manual

```bash
# 1. Pastikan semua perubahan sudah di-commit
git add .
git commit -m "Your changes"
git push origin master

# 2. Build packages
yarn build

# 3. Test
yarn test

# 4. Create dan push tag
git tag v0.2.13-bageur
git push origin v0.2.13-bageur
```

## Update Version di Project

Ketika ada update di craft.js dan Anda ingin upgrade:

```bash
# Di project isi-page-fe
yarn upgrade @craftjs/core@github:bageurinc/craft.js#v0.2.13-bageur
```

Atau edit `package.json` dan ubah tag version, lalu:
```bash
yarn install
```

## Versioning

Format: `v{major}.{minor}.{patch}-bageur`

| Version | Keterangan |
|---------|------------|
| `v0.2.12-bageur` | Bug fixes, small improvements |
| `v0.3.0-bageur` | New features, minor changes |
| `v1.0.0-bageur` | Major release, breaking changes |

## Tags yang Tersedia

Lihat semua tags di:
- https://github.com/bageurinc/craft.js/tags

Atau via command line:
```bash
git ls-remote --tags https://github.com/bageurinc/craft.js.git
```

## Troubleshooting

### ❌ Error: Cannot find module '@craftjs/core'

**Solusi:**
Pastikan packages sudah di-build sebelum create tag:
```bash
cd craft.js
yarn build
git tag v0.2.13-bageur -f  # Force recreate tag
git push origin v0.2.13-bageur -f
```

### ❌ Error: Package not found

**Solusi:**
Clear cache dan reinstall:
```bash
yarn cache clean
rm -rf node_modules yarn.lock
yarn install
```

### ❌ Not updating to latest tag

**Solusi:**
Remove package dan install ulang:
```bash
yarn remove @craftjs/core
yarn add @craftjs/core@github:bageurinc/craft.js#v0.2.13-bageur
```

### ❌ Build errors in craft.js

**Solusi:**
Pastikan dependencies terinstall:
```bash
cd craft.js
yarn install
yarn build
```

## Development Workflow

### A. Modify Craft.js

```bash
# 1. Clone repo (jika belum)
git clone git@github.com:bageurinc/craft.js.git
cd craft.js

# 2. Install dependencies
yarn install

# 3. Make changes
# ... edit files ...

# 4. Test locally dengan Yalc
yarn dev:yalc

# Di project lain (isi-page-fe)
cd ../isi-page-fe
yalc add @craftjs/core
```

### B. Release Changes

```bash
# 1. Commit changes
git add .
git commit -m "feat: add new feature"
git push origin master

# 2. Create tag
./scripts/create-tag.sh v0.2.13-bageur

# 3. Update di project lain
cd ../isi-page-fe
yarn upgrade @craftjs/core@github:bageurinc/craft.js#v0.2.13-bageur
```

## Keuntungan Install dari GitHub

✅ **Control penuh** - Anda kontrol version dan customizations
✅ **Private modifications** - Custom features tanpa publish ke NPM
✅ **Fast updates** - Langsung pakai tanpa tunggu NPM publish
✅ **Version pinning** - Pin ke specific tag/commit
✅ **No NPM account needed** - Tidak perlu setup NPM publishing

## Kelemahan

❌ **Slower install** - Download dari GitHub lebih lambat dari NPM
❌ **Requires build** - Harus build sebelum create tag
❌ **No version resolver** - Tidak ada automatic semver resolution
❌ **Cache issues** - Yarn cache kadang perlu di-clear manual

## Alternative: Yalc (untuk Development)

Untuk development aktif tanpa create tag terus-menerus:

```bash
# Di craft.js
yarn dev:yalc

# Di isi-page-fe
yalc add @craftjs/core

# Setelah selesai development
yalc remove @craftjs/core
yarn add @craftjs/core@github:bageurinc/craft.js#v0.2.13-bageur
```

## Questions?

Lihat dokumentasi lengkap di `TAGGING.md` atau baca official docs di https://craft.js.org/
