#!/bin/bash

# Script untuk membuat git tag untuk instalasi dari GitHub
# Usage: ./scripts/create-tag.sh v0.2.13-bageur

set -e

if [ -z "$1" ]; then
  echo "❌ Error: Version tag required!"
  echo ""
  echo "Usage: ./scripts/create-tag.sh v0.2.13-bageur"
  echo ""
  echo "Format: v{major}.{minor}.{patch}-bageur"
  echo "Example: v0.2.13-bageur"
  exit 1
fi

TAG=$1

echo "🔍 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Error: Working directory not clean!"
  echo "Please commit or stash your changes first."
  exit 1
fi

echo "🏗️  Building packages..."
yarn build

echo "🧪 Running tests..."
yarn test

echo "📝 Creating tag: $TAG"
git tag $TAG

echo "📤 Pushing tag to GitHub..."
git push origin $TAG

echo ""
echo "✅ Success! Tag $TAG created and pushed."
echo ""
echo "📦 To install in other projects, use:"
echo "   yarn add @craftjs/core@github:bageurinc/craft.js#$TAG"
echo "   yarn add @craftjs/layers@github:bageurinc/craft.js#$TAG"
echo ""
echo "Or add to package.json:"
echo '   "@craftjs/core": "github:bageurinc/craft.js#'$TAG'"'
echo ""
