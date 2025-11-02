# Garus AI - Next Generation (Final GitHub-ready)

This repository builds an Android APK named `garus.ai.apk` via GitHub Actions.
It contains an offline-first app plus optional Ollama connectivity (default IP 192.168.1.100).

## What is included
- `www/` : web app (Cordova) with red-black-gold futurist theme
- `www/assets/logo.png` : placeholder logo (replace with your GARUS PNG 512x512)
- GitHub Actions workflow: `.github/workflows/build-apk.yml` that builds APK on push to `main`

## Quick steps to get APK (3 steps)
1. Replace the placeholder logo:
   - Put your real GARUS PNG file at `www/assets/logo.png` (recommended 512×512, transparent background).
2. Create a new GitHub repository, commit & push all files from this ZIP to the `main` branch.
3. Open the repository on GitHub → go to **Actions** → wait for the `build-apk` workflow to finish → download the artifact `GarusAI-apk` which contains the APK (artifact filename usually `app-*-release.apk`).

**Default Ollama IP:** `192.168.1.100` — if your PC has a different IP, edit `www/script.js` and change `OLLAMA_IP` variable before pushing.

## Notes about signing/installing
- The APK in artifacts may be unsigned; to install on many Android devices, you can install debug builds directly (enable Unknown Sources). For Play Store distribution you must sign the APK with your keystore.
- The workflow uses Cordova + Android SDK on GitHub-hosted runner. Build time ~3–8 minutes.

If you want, I can also push this repo to your GitHub for you (you'd need to provide a temporary access token) or generate the APK in a CI account you provide. Otherwise follow steps above and tell me when it's uploaded; I'll guide you to download the APK step-by-step.
