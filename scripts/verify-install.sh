#!/bin/bash
# Verify Craft.js fork installation in consumer project
# Usage: ./scripts/verify-install.sh [consumer-path]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONSUMER_PATH="${1:-../isi-page-fe}"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Craft.js Fork - Installation Verifier      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check if consumer directory exists
if [ ! -d "$CONSUMER_PATH" ]; then
    echo -e "${RED}✖ Error: Directory not found: $CONSUMER_PATH${NC}"
    exit 1
fi

cd "$CONSUMER_PATH"

echo -e "${BLUE}📂 Checking:${NC} $CONSUMER_PATH"
echo ""

# Initialize counters
PASS=0
FAIL=0
WARN=0

# Function to print test result
test_result() {
    local status=$1
    local message=$2
    local detail=$3

    if [ "$status" = "pass" ]; then
        echo -e "${GREEN}✓${NC} $message"
        [ -n "$detail" ] && echo -e "  ${BLUE}→${NC} $detail"
        ((PASS++))
    elif [ "$status" = "fail" ]; then
        echo -e "${RED}✖${NC} $message"
        [ -n "$detail" ] && echo -e "  ${RED}→${NC} $detail"
        ((FAIL++))
    else
        echo -e "${YELLOW}⚠${NC} $message"
        [ -n "$detail" ] && echo -e "  ${YELLOW}→${NC} $detail"
        ((WARN++))
    fi
}

# Test 1: package.json exists
echo -e "${YELLOW}Testing package.json...${NC}"
if [ -f "package.json" ]; then
    test_result "pass" "package.json found"
else
    test_result "fail" "package.json not found"
    exit 1
fi
echo ""

# Test 2: @craftjs/core in dependencies
echo -e "${YELLOW}Testing @craftjs/core dependency...${NC}"
CRAFTJS_DEP=$(node -e "
const pkg = require('./package.json');
const dep = pkg.dependencies?.['@craftjs/core'] || pkg.devDependencies?.['@craftjs/core'];
console.log(dep || '');
" 2>/dev/null)

if [ -n "$CRAFTJS_DEP" ]; then
    if [[ "$CRAFTJS_DEP" == github:* ]]; then
        test_result "pass" "@craftjs/core found in dependencies" "$CRAFTJS_DEP"
    else
        test_result "warn" "@craftjs/core found but not using GitHub" "$CRAFTJS_DEP"
    fi
else
    test_result "fail" "@craftjs/core not found in dependencies"
fi
echo ""

# Test 3: node_modules installation
echo -e "${YELLOW}Testing node_modules...${NC}"
if [ -d "node_modules" ]; then
    test_result "pass" "node_modules directory exists"

    # Check @craftjs/core specifically
    if [ -d "node_modules/@craftjs/core" ]; then
        test_result "pass" "@craftjs/core installed in node_modules"

        # Get installed version
        if [ -f "node_modules/@craftjs/core/package.json" ]; then
            VERSION=$(node -e "console.log(require('./node_modules/@craftjs/core/package.json').version)" 2>/dev/null || echo "unknown")
            test_result "pass" "Package version detected" "$VERSION"
        fi
    else
        test_result "fail" "@craftjs/core not found in node_modules" "Run: npm install"
    fi
else
    test_result "fail" "node_modules not found" "Run: npm install"
fi
echo ""

# Test 4: Git repository check (if using git dependency)
if [[ "$CRAFTJS_DEP" == github:* ]]; then
    echo -e "${YELLOW}Testing Git repository...${NC}"

    # Extract repo from dependency
    REPO=$(echo "$CRAFTJS_DEP" | sed 's/github://' | sed 's/#.*//')

    # Try to access the repository info
    if [ -d "node_modules/@craftjs/core/.git" ]; then
        test_result "pass" "Git repository cloned"

        # Get current commit
        COMMIT=$(cd node_modules/@craftjs/core && git rev-parse HEAD 2>/dev/null | cut -c1-7)
        if [ -n "$COMMIT" ]; then
            test_result "pass" "Git commit found" "$COMMIT"
        fi
    else
        test_result "warn" "No .git directory found" "Package may be cached"
    fi
    echo ""
fi

# Test 5: Import test
echo -e "${YELLOW}Testing imports...${NC}"
if [ -d "node_modules/@craftjs/core" ]; then
    # Try to require the package
    IMPORT_TEST=$(node -e "
    try {
        const craft = require('@craftjs/core');
        console.log('success');
    } catch (e) {
        console.log('error: ' + e.message);
    }
    " 2>&1)

    if [[ "$IMPORT_TEST" == "success" ]]; then
        test_result "pass" "Package can be imported successfully"
    else
        test_result "fail" "Package import failed" "$IMPORT_TEST"
    fi
fi
echo ""

# Test 6: Check for common files
echo -e "${YELLOW}Testing package structure...${NC}"
CORE_PATH="node_modules/@craftjs/core"

if [ -d "$CORE_PATH" ]; then
    # Check for essential files
    [ -f "$CORE_PATH/package.json" ] && test_result "pass" "package.json exists"
    [ -f "$CORE_PATH/README.md" ] && test_result "pass" "README.md exists"

    # Check for build outputs
    if [ -d "$CORE_PATH/dist" ] || [ -d "$CORE_PATH/lib" ]; then
        test_result "pass" "Build output directory found"
    else
        test_result "warn" "No dist/lib directory" "Package may not be built"
    fi
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Verification Summary              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}✓ Passed:${NC}  $PASS"
echo -e "${YELLOW}⚠ Warnings:${NC} $WARN"
echo -e "${RED}✖ Failed:${NC}  $FAIL"
echo ""

# Overall result
if [ $FAIL -eq 0 ]; then
    if [ $WARN -eq 0 ]; then
        echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║        ✨ All checks passed! ✨               ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${BLUE}ℹ${NC}  Your Craft.js fork is properly installed and ready to use."
        exit 0
    else
        echo -e "${YELLOW}╔════════════════════════════════════════════════╗${NC}"
        echo -e "${YELLOW}║       Installation OK with warnings           ║${NC}"
        echo -e "${YELLOW}╚════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${YELLOW}ℹ${NC}  Your installation is functional but has some warnings."
        echo -e "${YELLOW}ℹ${NC}  Review the warnings above for potential issues."
        exit 0
    fi
else
    echo -e "${RED}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║          Installation has issues!              ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}ℹ${NC}  Please fix the failed checks above."
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "  1. Run: npm install"
    echo -e "  2. Clear cache: npm cache clean --force"
    echo -e "  3. Remove and reinstall: rm -rf node_modules && npm install"
    echo ""
    exit 1
fi
