# Manual Git Tagging Workflow

## Cara Membuat Tag untuk Digunakan di Project Lain

### 1. Build dan Pastikan Semuanya Berfungsi

```bash
# Build semua packages
yarn build

# Pastikan test pass
yarn test

# Commit semua perubahan
git add .
git commit -m "Your changes description"
git push origin master
```

### 2. Buat Git Tag

```bash
# Format: v{version}-bageur
# Contoh untuk version 0.2.12:
git tag v0.2.12-bageur

# Atau untuk version baru (misal 0.2.13):
git tag v0.2.13-bageur

# Push tag ke GitHub
git push origin v0.2.12-bageur
```

### 3. Install di Project Lain (isi-page-fe)

Ada 2 cara:

#### Cara A: Install Package Tertentu

```bash
# Install @craftjs/core dari GitHub
yarn add @craftjs/core@github:bageurinc/craft.js#v0.2.12-bageur

# Install @craftjs/layers dari GitHub
yarn add @craftjs/layers@github:bageurinc/craft.js#v0.2.12-bageur
```

#### Cara B: Install dari Subdirectory (Lebih Specific)

Jika ingin install langsung dari folder packages/core:

```bash
yarn add @craftjs/core@https://github.com/bageurinc/craft.js.git#v0.2.12-bageur:packages/core
```

### 4. Tambahkan ke package.json (Rekomendasi)

Edit `package.json` di project isi-page-fe:

```json
{
  "dependencies": {
    "@craftjs/core": "github:bageurinc/craft.js#v0.2.12-bageur",
    "@craftjs/layers": "github:bageurinc/craft.js#v0.2.12-bageur"
  }
}
```

Kemudian:
```bash
yarn install
```

## Version Naming Convention

Format tag: `v{major}.{minor}.{patch}-bageur`

Contoh:
- `v0.2.12-bageur` - Version saat ini
- `v0.2.13-bageur` - Bug fixes
- `v0.3.0-bageur` - New features
- `v1.0.0-bageur` - Major release

## Update Version di Project

Ketika ada update di craft.js:

```bash
# Di project craft.js
git tag v0.2.13-bageur
git push origin v0.2.13-bageur

# Di project isi-page-fe
yarn upgrade @craftjs/core@github:bageurinc/craft.js#v0.2.13-bageur
```

## Melihat Tag yang Tersedia

```bash
# List semua tags
git tag -l

# Lihat tag di GitHub
# https://github.com/bageurinc/craft.js/tags
```

## Hapus Tag (Jika Salah)

```bash
# Hapus tag lokal
git tag -d v0.2.12-bageur

# Hapus tag di remote
git push --delete origin v0.2.12-bageur
```

## Troubleshooting

### Error: Cannot find module '@craftjs/core'

Pastikan package sudah di-build sebelum create tag:
```bash
yarn build
```

### Error: No "exports" main defined

Tambahkan `prepare` script di root package.json (sudah ditambahkan).

### Cache Issue

Jika install dari GitHub tidak update:
```bash
# Clear yarn cache
yarn cache clean

# Install ulang
rm -rf node_modules yarn.lock
yarn install
```
