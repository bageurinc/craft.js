# Quick Start - craft.js untuk Project Bageur

## ✅ Setup Selesai!

Tag `v0.2.12-bageur` sudah berhasil dibuat dan di-push ke GitHub.

## 📦 Install di Project isi-page-fe

### Cara 1: Via yarn add (Recommended)

```bash
cd isi-page-fe

yarn add @craftjs/core@github:bageurinc/craft.js#v0.2.12-bageur
yarn add @craftjs/layers@github:bageurinc/craft.js#v0.2.12-bageur
```

### Cara 2: Edit package.json

Tambahkan di `package.json`:

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

## 🔄 Update ke Version Baru

### 1. Buat perubahan di craft.js

```bash
cd craft.js

# Edit files...
git add .
git commit -m "feat: your changes"
git push origin master
```

### 2. Build dan buat tag baru

```bash
# Pastikan build berhasil
yarn build

# Buat tag baru (misal v0.2.13-bageur)
git tag v0.2.13-bageur
git push origin v0.2.13-bageur
```

Atau gunakan script otomatis:

```bash
./scripts/create-tag.sh v0.2.13-bageur
```

### 3. Update di isi-page-fe

```bash
cd ../isi-page-fe

yarn upgrade @craftjs/core@github:bageurinc/craft.js#v0.2.13-bageur
yarn upgrade @craftjs/layers@github:bageurinc/craft.js#v0.2.13-bageur
```

## 🎯 Tags yang Tersedia

Lihat di: https://github.com/bageurinc/craft.js/tags

Atau via command:
```bash
git tag -l
```

## 📚 Dokumentasi Lengkap

- **TAGGING.md** - Workflow tagging manual
- **INSTALL-FROM-GITHUB.md** - Guide lengkap install dari GitHub
- **CLAUDE.md** - Dokumentasi project craft.js

## ⚠️ Catatan Penting

1. **Build diperlukan sebelum create tag** - Tag harus berisi dist/ dan lib/ yang sudah di-build
2. **Yarn 3 dengan node_modules** - Project ini menggunakan Yarn 3 tapi dengan node_modules linker (bukan PnP)
3. **Tests otomatis** - Saat push tag, tests akan jalan otomatis
4. **Husky hooks** - Kadang perlu skip dengan `HUSKY_SKIP_HOOKS=1` jika ada masalah

## 🛠️ Troubleshooting

### Error: Cannot find module '@craftjs/core'

Build ulang dan recreate tag:
```bash
yarn build
git tag v0.2.12-bageur -f
git push origin v0.2.12-bageur -f
```

### Cache issue

Clear yarn cache di project yang mau install:
```bash
cd isi-page-fe
yarn cache clean
rm -rf node_modules yarn.lock
yarn install
```

### Husky pre-push error

Skip hooks sementara:
```bash
HUSKY_SKIP_HOOKS=1 git push origin master
```

## 📞 Need Help?

Baca dokumentasi lengkap di:
- TAGGING.md
- INSTALL-FROM-GITHUB.md
- https://craft.js.org/
