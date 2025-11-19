#!/bin/bash

# Craft.js Fork Release Script
# Creates a git tag for easy installation via GitHub

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Craft.js Fork Release Script${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "lerna.json" ]; then
  echo -e "${RED}❌ Error: Must run from craft.js root directory${NC}"
  exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
  echo ""
  git status --short
  echo ""
  read -p "Do you want to commit these changes? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Commit message: " commit_msg
    git add .
    git commit -m "$commit_msg"
    echo -e "${GREEN}✓ Changes committed${NC}"
  else
    echo -e "${RED}❌ Aborted. Please commit or stash changes first.${NC}"
    exit 1
  fi
fi

# Get current version from packages/core/package.json
CURRENT_VERSION=$(node -p "require('./packages/core/package.json').version")
echo -e "Current version: ${YELLOW}${CURRENT_VERSION}${NC}"
echo ""

# Ask for new version
read -p "Enter new version tag (e.g., v0.2.13-darkmode): " VERSION_TAG

# Validate version tag format
if [[ ! $VERSION_TAG =~ ^v[0-9]+\.[0-9]+\.[0-9]+.*$ ]]; then
  echo -e "${RED}❌ Invalid version format. Use format: v0.2.13 or v0.2.13-darkmode${NC}"
  exit 1
fi

# Check if tag already exists
if git rev-parse "$VERSION_TAG" >/dev/null 2>&1; then
  echo -e "${RED}❌ Tag $VERSION_TAG already exists${NC}"
  echo -e "${YELLOW}Use 'git tag -d $VERSION_TAG' to delete it first${NC}"
  exit 1
fi

# Confirm
echo ""
echo -e "${YELLOW}About to:${NC}"
echo "  1. Build all packages"
echo "  2. Create git tag: $VERSION_TAG"
echo "  3. Push to origin"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}❌ Aborted${NC}"
  exit 1
fi

# Build
echo ""
echo -e "${GREEN}📦 Building packages...${NC}"
yarn build

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Build failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"

# Push to origin first
echo ""
echo -e "${GREEN}🔄 Pushing to origin...${NC}"
git push

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Push failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Pushed to origin${NC}"

# Create tag
echo ""
echo -e "${GREEN}🏷️  Creating tag $VERSION_TAG...${NC}"
git tag -a "$VERSION_TAG" -m "Release $VERSION_TAG"

# Push tag
echo -e "${GREEN}🔄 Pushing tag to origin...${NC}"
git push origin "$VERSION_TAG"

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to push tag${NC}"
  echo -e "${YELLOW}Tag created locally but not pushed. Run: git push origin $VERSION_TAG${NC}"
  exit 1
fi

# Success!
echo ""
echo -e "${GREEN}✅ Release $VERSION_TAG created successfully!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo ""
echo "Update isi-page-fe package.json:"
echo ""
echo -e "${GREEN}{${NC}"
echo -e "${GREEN}  \"dependencies\": {${NC}"
echo -e "${GREEN}    \"@craftjs/core\": \"github:bageurinc/craft.js#${VERSION_TAG}:packages/core\",${NC}"
echo -e "${GREEN}    \"@craftjs/layers\": \"github:bageurinc/craft.js#${VERSION_TAG}:packages/layers\"${NC}"
echo -e "${GREEN}  }${NC}"
echo -e "${GREEN}}${NC}"
echo ""
echo "Then run:"
echo -e "${YELLOW}  cd ../isi-page-fe${NC}"
echo -e "${YELLOW}  rm -rf node_modules yarn.lock${NC}"
echo -e "${YELLOW}  yarn install${NC}"
echo ""
echo -e "${GREEN}Done! 🎉${NC}"
