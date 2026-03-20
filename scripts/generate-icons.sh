#!/bin/bash
# Generates App Store icon from SVG
# Requires: brew install librsvg (or use Inkscape)
# Run from project root: bash scripts/generate-icons.sh

set -e

echo "Generating iOS App Icon..."

# Check for rsvg-convert
if command -v rsvg-convert &> /dev/null; then
  rsvg-convert -w 1024 -h 1024 public/icon.svg -o ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png
  echo "✅ App icon generated successfully!"
elif command -v sips &> /dev/null; then
  # Fallback: Use macOS sips with a temporary PNG
  echo "rsvg-convert not found. Please install it:"
  echo "  brew install librsvg"
  echo ""
  echo "Or manually export public/icon.svg as 1024x1024 PNG and save to:"
  echo "  ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png"
  exit 1
else
  echo "No image conversion tools found. Please manually create a 1024x1024 PNG from public/icon.svg"
  exit 1
fi
