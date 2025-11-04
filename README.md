GARUS.AI v2 - Neon (Offline + Ollama + Voice)
=============================================

This package contains the Garus AI v2 web app ready to be wrapped into an Android app (Cordova).
Features:
- Neon futuristic theme
- Offline fallback + Ollama proxy support (default IP 192.168.1.100)
- Mic input (SpeechRecognition) and Voice output (SpeechSynthesis)
- No login required

How to use:
1. Replace assets/logo.png with your GARUS PNG (512x512 recommended).
2. If you want Ollama on your PC, run ollama and the backend proxy (server.js) from previous package.
3. To build APK via GitHub Actions, include the workflow file in .github/workflows/build-apk.yml (we provided in previous package).

Notes:
- Some mobile browsers may restrict microphone use on file:// pages. For full mic support, wrap into WebView (APK) or serve via local HTTP server.
