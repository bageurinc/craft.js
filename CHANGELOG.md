# Changelog

All notable changes to this Craft.js fork will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Installation guide (INSTALLATION.md)
- Publishing guide (PUBLISH-GUIDE.md)
- Automated release script (scripts/release.sh)
- Consumer update script (scripts/update-consumer.sh)
- Installation verification script (scripts/verify-install.sh)
- Enhanced README with fork-specific documentation

### Changed
- Updated README badges to reflect GitHub-based distribution
- Added git-based installation instructions

## [1.0.0] - 2025-01-19

### Added
- Initial fork from prevwong/craft.js
- Project setup for git-based distribution
- CLAUDE.md for development documentation
- Support for direct GitHub installation

### Changed
- Modified package.json for monorepo structure
- Updated build configuration for compatibility

### Notes
- This is the first official release of the fork
- Maintains compatibility with original Craft.js API
- Designed for use in isi-page project

---

## Version Guidelines

This fork uses [Semantic Versioning](https://semver.org/):

- **MAJOR version** (X.0.0): Breaking changes, incompatible API changes
- **MINOR version** (0.X.0): New features, backward-compatible functionality
- **PATCH version** (0.0.X): Bug fixes, backward-compatible patches

## Categories

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Features that will be removed in future versions
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security vulnerabilities

## Release Process

1. Update this CHANGELOG.md with all changes since last release
2. Run `./scripts/release.sh <version> "<message>"`
3. Script will create and push git tag
4. Users can install via `npm install github:gin31259461/craft.js#v<version>`

## Comparing with Original

This fork maintains compatibility with the original Craft.js while adding:

- Git-based distribution (no npm publishing required)
- Automated release scripts
- Enhanced documentation
- Project-specific improvements

For original Craft.js changes, see: https://github.com/prevwong/craft.js/releases

[Unreleased]: https://github.com/gin31259461/craft.js/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/gin31259461/craft.js/releases/tag/v1.0.0
