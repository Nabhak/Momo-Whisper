# Third-Party Notices

Momo Whisper is proprietary software (© 2026 Nabhak. All rights reserved. — see `LICENSE`).
It includes portions of the open-source software listed below. Each component is used under
its own license, reproduced here as that license requires.

---

## WhisperApp

- **Author:** Viriya Langkaviket (Gamezxz)
- **Source:** https://github.com/Gamezxz/WhisperApp
- **License:** MIT
- **Used for:** the original menu-bar dictation app that Momo Whisper is built on (portions of the
  app's Swift source, and the original build scripts).
- **Note:** the original project declares "License: MIT" in its README. The notice below is the
  standard MIT License text with the original author's copyright line.

```
MIT License

Copyright (c) 2026 Viriya Langkaviket (Gamezxz) — original Whisper: https://github.com/Gamezxz/WhisperApp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## PermissionFlow

- **Author:** 小弟调调 (jaywcjlove)
- **Source:** https://github.com/jaywcjlove/PermissionFlow
- **License:** MIT
- **Used for:** the approach behind the System Settings "drag Momo Whisper to the list above" helper
  (`Sources/PermissionHelper.swift`, `Sources/PermissionHelperPanel.swift`). The code is our own
  implementation; the approach is adapted from PermissionFlow — locating the System Settings window via the window server,
  docking a non-activating panel under it, and the Finder-style pasteboard types used for the dragged `.app`.

```
MIT License

Copyright (c) 2026 小弟调调

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Other components

Momo Whisper has no third-party Swift package dependencies. It uses only Apple system frameworks
(SwiftUI, AppKit, AVFoundation, Speech, NaturalLanguage, and others) provided by macOS.

Speech-to-text and text processing run on third-party cloud services (for example Groq) using an
API key that you supply. Those services are not part of this app and are governed by their own
terms of service and privacy policies.

## Artwork

The Momo mascot, app icon, menu-bar icons, logo and website images are original artwork —
Momo artwork © 2026 Nabhak. All rights reserved. They are not covered by the MIT License above.
