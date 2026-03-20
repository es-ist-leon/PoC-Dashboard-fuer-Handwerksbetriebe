#!/bin/bash
# Full build + iOS sync script
# Run from project root on your Mac

set -e

echo "🔨 Building web app..."
npm run build

echo "📱 Syncing to iOS..."
npx cap sync ios

echo "✅ Done! Now open Xcode:"
echo "   npx cap open ios"
echo ""
echo "In Xcode:"
echo "  1. Select your Team under Signing & Capabilities"
echo "  2. Set the Bundle Identifier (e.g. com.deinefirma.dashboard)"
echo "  3. Product → Archive"
echo "  4. Distribute App → App Store Connect"
