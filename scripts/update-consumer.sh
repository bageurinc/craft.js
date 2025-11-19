#!/bin/bash
# Update isi-page-fe to use latest Craft.js fork
# Usage: ./scripts/update-consumer.sh [tag]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONSUMER_PATH="../isi-page-fe"
CRAFT_REPO="bageurinc/craft.js"
DEFAULT_TAG="latest"

# Get tag from argument or use default
TAG="${1:-$DEFAULT_TAG}"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Craft.js Fork - Consumer Update Script     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check if consumer directory exists
if [ ! -d "$CONSUMER_PATH" ]; then
    echo -e "${RED}✖ Error: Consumer directory not found at $CONSUMER_PATH${NC}"
    echo -e "${YELLOW}  Please adjust CONSUMER_PATH in this script${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Consumer Path:${NC} $CONSUMER_PATH"
echo -e "${BLUE}🏷️  Installing Tag:${NC} $TAG"
echo ""

# Step 1: Get the tag commit hash
echo -e "${YELLOW}[1/4]${NC} Fetching tag information..."
if [ "$TAG" = "latest" ]; then
    # Get the latest tag
    TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
    if [ -z "$TAG" ]; then
        echo -e "${RED}✖ No tags found. Please create a tag first using ./scripts/release.sh${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} Found latest tag: $TAG"
else
    # Verify tag exists
    if ! git rev-parse "$TAG" >/dev/null 2>&1; then
        echo -e "${RED}✖ Tag '$TAG' not found${NC}"
        echo -e "${YELLOW}  Available tags:${NC}"
        git tag -l | sed 's/^/    /'
        exit 1
    fi
    echo -e "${GREEN}✓${NC} Tag verified: $TAG"
fi

# Get commit hash
COMMIT_HASH=$(git rev-parse "$TAG")
echo -e "${GREEN}✓${NC} Commit: ${COMMIT_HASH:0:7}"
echo ""

# Step 2: Update package.json
echo -e "${YELLOW}[2/4]${NC} Updating package.json in consumer..."

cd "$CONSUMER_PATH"

# Create backup
if [ -f "package.json" ]; then
    cp package.json package.json.backup
    echo -e "${GREEN}✓${NC} Backup created: package.json.backup"
fi

# Update @craftjs packages
PACKAGES_UPDATED=0

# Update @craftjs/core
if grep -q "@craftjs/core" package.json; then
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const gitUrl = 'github:${CRAFT_REPO}#${TAG}';

    if (pkg.dependencies && pkg.dependencies['@craftjs/core']) {
        pkg.dependencies['@craftjs/core'] = gitUrl;
    }
    if (pkg.devDependencies && pkg.devDependencies['@craftjs/core']) {
        pkg.devDependencies['@craftjs/core'] = gitUrl;
    }

    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    console.log('Updated @craftjs/core to: ' + gitUrl);
    "
    echo -e "${GREEN}✓${NC} Updated @craftjs/core"
    ((PACKAGES_UPDATED++))
fi

# Update @craftjs/layers
if grep -q "@craftjs/layers" package.json; then
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const gitUrl = 'github:${CRAFT_REPO}#${TAG}';

    if (pkg.dependencies && pkg.dependencies['@craftjs/layers']) {
        pkg.dependencies['@craftjs/layers'] = gitUrl;
    }
    if (pkg.devDependencies && pkg.devDependencies['@craftjs/layers']) {
        pkg.devDependencies['@craftjs/layers'] = gitUrl;
    }

    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    console.log('Updated @craftjs/layers to: ' + gitUrl);
    "
    echo -e "${GREEN}✓${NC} Updated @craftjs/layers"
    ((PACKAGES_UPDATED++))
fi

# Update @craftjs/utils (if exists)
if grep -q "@craftjs/utils" package.json; then
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const gitUrl = 'github:${CRAFT_REPO}#${TAG}';

    if (pkg.dependencies && pkg.dependencies['@craftjs/utils']) {
        pkg.dependencies['@craftjs/utils'] = gitUrl;
    }
    if (pkg.devDependencies && pkg.devDependencies['@craftjs/utils']) {
        pkg.devDependencies['@craftjs/utils'] = gitUrl;
    }

    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    console.log('Updated @craftjs/utils to: ' + gitUrl);
    "
    echo -e "${GREEN}✓${NC} Updated @craftjs/utils"
    ((PACKAGES_UPDATED++))
fi

if [ $PACKAGES_UPDATED -eq 0 ]; then
    echo -e "${RED}✖ No @craftjs packages found in package.json${NC}"
    rm package.json.backup
    exit 1
fi

echo -e "${GREEN}✓${NC} Updated $PACKAGES_UPDATED package(s)"

echo ""

# Step 3: Install dependencies
echo -e "${YELLOW}[3/4]${NC} Installing dependencies..."
echo -e "${BLUE}ℹ${NC}  This may take a few minutes..."
echo ""

# Detect package manager
if [ -f "yarn.lock" ]; then
    echo -e "${BLUE}📦 Using Yarn...${NC}"
    yarn install
elif [ -f "pnpm-lock.yaml" ]; then
    echo -e "${BLUE}📦 Using pnpm...${NC}"
    pnpm install
else
    echo -e "${BLUE}📦 Using npm...${NC}"
    npm install
fi

echo ""
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Step 4: Summary
echo -e "${YELLOW}[4/4]${NC} Installation summary"
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           Update Completed Successfully       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📦 Packages:${NC}   $PACKAGES_UPDATED package(s) updated"
echo -e "${BLUE}🏷️  Tag:${NC}       $TAG"
echo -e "${BLUE}📝 Commit:${NC}    ${COMMIT_HASH:0:7}"
echo -e "${BLUE}📂 Location:${NC}  $CONSUMER_PATH"
echo ""

# Show what changed
echo -e "${YELLOW}Changes made:${NC}"
echo -e "  • package.json updated with git dependency"
echo -e "  • Dependencies reinstalled"
echo -e "  • Backup saved as package.json.backup"
echo ""

# Verify installation
if [ -d "node_modules/@craftjs/core" ]; then
    echo -e "${GREEN}✓${NC} Verification: @craftjs/core is installed"

    # Show installed version info if available
    if [ -f "node_modules/@craftjs/core/package.json" ]; then
        INSTALLED_VERSION=$(node -e "console.log(require('./node_modules/@craftjs/core/package.json').version)")
        echo -e "${BLUE}ℹ${NC}  Installed version: $INSTALLED_VERSION"
    fi
else
    echo -e "${YELLOW}⚠${NC}  Warning: Could not verify installation"
fi

echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Test your application: npm run dev"
echo -e "  2. Check for any breaking changes"
echo -e "  3. Run your tests if available"
echo ""
echo -e "${YELLOW}To rollback:${NC}"
echo -e "  mv package.json.backup package.json && npm install"
echo ""

# Optional: Offer to clean backup
echo -e "${YELLOW}Keep backup file? (y/n)${NC} "
read -r -n 1 response
echo ""
if [[ "$response" =~ ^[Nn]$ ]]; then
    rm package.json.backup
    echo -e "${GREEN}✓${NC} Backup removed"
else
    echo -e "${BLUE}ℹ${NC}  Backup kept: package.json.backup"
fi

echo ""
echo -e "${GREEN}✨ Done!${NC}"
