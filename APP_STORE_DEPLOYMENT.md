# App Store Deployment - Handwerker Dashboard

## Voraussetzungen

- **Mac** mit macOS 14+ (Sonoma oder neuer)
- **Xcode 15+** (aus dem Mac App Store)
- **Node.js 18+** und npm
- **Apple Developer Account** (aktiv, $99/Jahr)
- **Ruby 3.x** und Bundler (fuer Fastlane)

## Schnellstart (3 Schritte)

### 1. Repo klonen und bauen

```bash
git clone <repo-url>
cd PoC-Dashboard-fuer-Handwerksbetriebe
npm install
npm run ios:sync
```

### 2. Xcode konfigurieren

```bash
npm run ios:open
```

In Xcode:
1. **Signing & Capabilities** Tab oeffnen
2. **Team** auswaehlen (dein Apple Developer Team)
3. **Bundle Identifier** pruefen: `com.meisterbauer.dashboard`
   - Falls noetig: aendern auf deine eigene ID, z.B. `com.deinefirma.handwerker-dashboard`
4. **Automatically manage signing** aktivieren

### 3. Zum App Store deployen

**Option A: Ueber Xcode (empfohlen fuer Erstveroeffentlichung)**

1. In Xcode: **Product > Archive**
2. Warte bis der Archive-Prozess abgeschlossen ist
3. Im Organizer: **Distribute App** klicken
4. **App Store Connect** waehlen
5. **Upload** klicken
6. Warte auf die Verarbeitung in App Store Connect

**Option B: Ueber Fastlane (empfohlen fuer Updates)**

```bash
# Einmalig: Fastlane einrichten
cd ios/App
bundle install

# Fastlane konfigurieren (Appfile bearbeiten)
# Trage deine Apple ID und Team ID ein

# TestFlight Upload
npm run ios:testflight

# App Store Release
npm run ios:appstore
```

## App Store Connect Setup

### Vor dem ersten Upload

1. Gehe zu [App Store Connect](https://appstoreconnect.apple.com)
2. **Meine Apps** > **+** > **Neue App**
3. Fuelle folgende Felder aus:

| Feld | Wert |
|------|------|
| Name | Handwerker Dashboard |
| Primaere Sprache | Deutsch |
| Bundle-ID | com.meisterbauer.dashboard |
| SKU | handwerker-dashboard-001 |

### App Store Informationen

Die Metadaten findest du bereits vorbereitet unter:
`ios/App/fastlane/metadata/de-DE/`

- `name.txt` - App-Name
- `subtitle.txt` - Untertitel
- `description.txt` - Beschreibung
- `keywords.txt` - Suchbegriffe
- `release_notes.txt` - Release Notes

### Pflichtangaben

| Angabe | Wert |
|--------|------|
| Kategorie | Business |
| Unterkategorie | Produktivitaet |
| Altersfreigabe | 4+ |
| Preis | Kostenlos (oder nach Wahl) |
| Datenschutz-URL | Muss eingerichtet werden! |
| Support-URL | Muss eingerichtet werden! |

### Screenshots (Pflicht!)

Du brauchst Screenshots fuer mindestens:
- **iPhone 6.7"** (iPhone 15 Pro Max): 1290 x 2796 px
- **iPhone 6.5"** (iPhone 11 Pro Max): 1242 x 2688 px
- **iPad Pro 12.9"** (optional aber empfohlen): 2048 x 2732 px

**Screenshots erstellen:**
1. Oeffne die App im Simulator (Xcode > Product > Run)
2. Waehle verschiedene Simulatoren fuer die Geraetegroessen
3. `Cmd + S` fuer Screenshot im Simulator
4. Screenshots findest du auf dem Desktop

### Datenschutzerklaerung

Apple verlangt eine Datenschutzerklaerung. Da die App keine Nutzerdaten sammelt:

1. Erstelle eine einfache Seite unter deiner Domain
2. Inhalt: "Diese App sammelt keine personenbezogenen Daten."
3. Trage die URL in App Store Connect ein

## Fastlane Konfiguration

### Appfile bearbeiten

Oeffne `ios/App/fastlane/Appfile` und ersetze die Platzhalter:

```ruby
app_identifier("com.meisterbauer.dashboard")  # Deine Bundle ID
apple_id("deine@email.com")                    # Deine Apple ID
team_id("ABC123DEF4")                          # Dein Team ID
```

**Team ID finden:**
- Gehe zu https://developer.apple.com/account
- Unter "Membership" findest du die Team ID

### ExportOptions anpassen

Oeffne `ios/App/ExportOptions.plist` und ersetze `DEIN_TEAM_ID` mit deiner echten Team ID.

## Haeufige Probleme

### "No signing certificate found"
```bash
# Loesung: Zertifikat in Xcode erstellen
# Xcode > Settings > Accounts > Manage Certificates > + > Apple Distribution
```

### "No provisioning profile"
- Aktiviere **Automatically manage signing** in Xcode
- Oder erstelle manuell unter https://developer.apple.com/account/resources/profiles

### "App icon missing"
Die App-Icons sind bereits generiert unter `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Build schlaegt fehl
```bash
# Clean Build
cd ios/App
xcodebuild clean -project App.xcodeproj -scheme App
cd ../..
npm run ios:sync
```

## Deployment-Befehle Uebersicht

| Befehl | Beschreibung |
|--------|-------------|
| `npm run ios:sync` | Web-App bauen und mit iOS synchronisieren |
| `npm run ios:open` | Xcode oeffnen |
| `npm run ios:build` | Vollstaendiger Build (ohne Upload) |
| `npm run ios:testflight` | Build + Upload zu TestFlight |
| `npm run ios:appstore` | Build + App Store Submission |

## Zeitlicher Ablauf

1. **Build & Upload**: ca. 10-15 Minuten
2. **App Store Verarbeitung**: ca. 15-30 Minuten
3. **App Review**: typischerweise 24-48 Stunden (kann variieren)
4. **Veroeffentlichung**: sofort nach Genehmigung (oder manuell)
