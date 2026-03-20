#!/bin/bash
# ============================================================
# Handwerker Dashboard - iOS App Store Deployment Script
# ============================================================
# Dieses Skript baut die Web-App, synchronisiert mit iOS
# und deployt zum App Store via Fastlane.
#
# Voraussetzungen:
#   - macOS mit Xcode 15+
#   - Node.js 18+
#   - Ruby 3.x + Bundler
#   - Apple Developer Account konfiguriert
#
# Verwendung:
#   ./scripts/deploy.sh [testflight|appstore|build]
# ============================================================

set -e

# Farben fuer Ausgabe
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DEPLOY_TARGET="${1:-build}"
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IOS_DIR="$PROJECT_ROOT/ios/App"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  Handwerker Dashboard - iOS Deployment${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# -----------------------------------------------------------
# Schritt 1: Abhaengigkeiten pruefen
# -----------------------------------------------------------
echo -e "${YELLOW}[1/5] Pruefe Abhaengigkeiten...${NC}"

command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js ist nicht installiert!${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}npm ist nicht installiert!${NC}"; exit 1; }

NODE_VERSION=$(node -v)
echo -e "  Node.js: ${GREEN}$NODE_VERSION${NC}"

if [ "$DEPLOY_TARGET" != "build" ]; then
  command -v fastlane >/dev/null 2>&1 || command -v bundle >/dev/null 2>&1 || {
    echo -e "${RED}Fastlane ist nicht installiert!${NC}"
    echo -e "Installiere mit: ${YELLOW}cd ios/App && bundle install${NC}"
    exit 1
  }
fi

echo -e "  ${GREEN}Alle Abhaengigkeiten vorhanden.${NC}"
echo ""

# -----------------------------------------------------------
# Schritt 2: npm Dependencies installieren
# -----------------------------------------------------------
echo -e "${YELLOW}[2/5] Installiere npm Pakete...${NC}"
cd "$PROJECT_ROOT"
npm ci --silent 2>/dev/null || npm install --silent
echo -e "  ${GREEN}npm Pakete installiert.${NC}"
echo ""

# -----------------------------------------------------------
# Schritt 3: Web-App bauen (Production Build)
# -----------------------------------------------------------
echo -e "${YELLOW}[3/5] Baue Web-App (Production)...${NC}"
npm run build
echo -e "  ${GREEN}Web-App erfolgreich gebaut.${NC}"
echo ""

# -----------------------------------------------------------
# Schritt 4: Capacitor iOS Sync
# -----------------------------------------------------------
echo -e "${YELLOW}[4/5] Synchronisiere mit iOS (Capacitor)...${NC}"
npx cap sync ios
echo -e "  ${GREEN}iOS Projekt synchronisiert.${NC}"
echo ""

# -----------------------------------------------------------
# Schritt 5: Deployment
# -----------------------------------------------------------
echo -e "${YELLOW}[5/5] Deployment: ${DEPLOY_TARGET}${NC}"

case "$DEPLOY_TARGET" in
  "build")
    echo -e "  ${GREEN}Build abgeschlossen!${NC}"
    echo ""
    echo -e "  Oeffne Xcode mit: ${YELLOW}npx cap open ios${NC}"
    echo ""
    echo -e "  In Xcode:"
    echo -e "    1. Waehle dein Team unter Signing & Capabilities"
    echo -e "    2. Product > Archive"
    echo -e "    3. Distribute App > App Store Connect"
    ;;

  "testflight")
    echo -e "  ${BLUE}Starte TestFlight Upload via Fastlane...${NC}"
    cd "$IOS_DIR"
    if [ -f "Gemfile" ]; then
      bundle exec fastlane beta
    else
      fastlane beta
    fi
    echo -e "  ${GREEN}TestFlight Upload abgeschlossen!${NC}"
    ;;

  "appstore")
    echo -e "  ${BLUE}Starte App Store Submission via Fastlane...${NC}"
    cd "$IOS_DIR"
    if [ -f "Gemfile" ]; then
      bundle exec fastlane release
    else
      fastlane release
    fi
    echo -e "  ${GREEN}App Store Submission abgeschlossen!${NC}"
    ;;

  *)
    echo -e "${RED}Unbekanntes Ziel: $DEPLOY_TARGET${NC}"
    echo "Verwendung: ./scripts/deploy.sh [build|testflight|appstore]"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Deployment erfolgreich!${NC}"
echo -e "${GREEN}============================================${NC}"
