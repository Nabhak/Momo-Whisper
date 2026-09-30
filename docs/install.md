# How to install Momo Whisper (and connect your AI via MCP)

> Plain-text copy of https://nabhak.github.io/Momo-Whisper/install.html for AI assistants and readers. Momo Whisper is a free macOS menu-bar app for voice dictation and translation, currently in public beta. Requires macOS 13 or later.

## Part 1 — Install the app (six steps, about two minutes)

### 1. Download and unzip
Download the latest version: https://github.com/Nabhak/Momo-Whisper/releases/latest/download/Momo-Whisper.zip
Your browser saves a .zip file to Downloads. Double-click it to unzip; you get an app called **Momo Whisper**.

### 2. Move it into Applications
Drag Momo Whisper into your **Applications** folder (Finder → Applications in the sidebar).

### 3. Open it the first time
macOS shows a warning like "Apple could not verify Momo Whisper is free of malware." Nothing is wrong: macOS says this about every free indie app that hasn't paid Apple's notarization fee. You only need to get past it once. Pick one way:

- **Option A (no typing):** in Applications, right-click (or Control-click) Momo Whisper → **Open**. The warning appears again, now with an **Open** button. Click it.
  - No Open button? Go to **System Settings → Privacy & Security**, scroll to "Momo Whisper was blocked", click **Open Anyway**, then enter your Mac password.
- **Option B (one Terminal command):** open Terminal (Applications → Utilities), paste this and press Return:

  ```
  xattr -dr com.apple.quarantine "/Applications/Momo Whisper.app"
  ```

  It only removes the "downloaded from the internet" quarantine flag.

After it opens once, Momo Whisper launches normally from then on.

### 4. Allow a few permissions
On first launch, Momo walks you through them:

- **Microphone** — so it can hear you when you dictate.
- **Accessibility** — so it can type the finished text into whatever app you're in.
- **Speech Recognition** (recommended, optional) — faster, more accurate on-device transcription; that audio stays on your Mac.

You can change these anytime in System Settings → Privacy & Security.

### 5. Add your free Groq key
Momo uses Groq to turn speech into text and to translate it. It needs a free **Groq API key**: create one at https://console.groq.com, copy it, and paste it into Momo (the setup guide or Settings). The key is stored locally on your Mac. Groq's free tier is generous for everyday dictation.

### 6. Start talking
- Hold **Fn** and speak to dictate.
- Hold **Fn + Shift** to speak one language and have it typed in another.
- Highlight any text and click the translate button to translate it in place.

The menu-bar icon shows a live waveform while it listens.

## Part 2 — Connect your AI (MCP, optional)

Works with Claude Desktop (one click) and any app that supports local (stdio) MCP servers — Claude Code, Cursor, Codex, Gemini CLI, VS Code, Zed, Continue, Goose, Warp, Windsurf and more. Your AI reads your Momo dictation history, proposes fixes for words Momo keeps mishearing, and you approve. Momo must be installed first (Part 1) — the MCP server ships inside the app. The ChatGPT and Gemini web/desktop apps don't support local MCP servers yet.

### Claude Desktop — one click
Download https://github.com/Nabhak/Momo-Whisper/releases/latest/download/momo-whisper.mcpb, double-click it, then choose **Install**. No config file to edit.

### Any other MCP app
Add one server with these two values (no arguments, no keys):

- **Server name:** `momo-whisper`
- **Command:** `/Applications/Momo Whisper.app/Contents/MacOS/momo-mcp`

Most apps (Cursor, Gemini CLI, Windsurf, Warp, Claude Desktop's config file) use this JSON in their MCP config file; restart the app after:

```json
{ "mcpServers": { "momo-whisper": { "command": "/Applications/Momo Whisper.app/Contents/MacOS/momo-mcp" } } }
```

Other apps:

- **Claude Code** (Terminal):
  ```
  claude mcp add -s user momo-whisper -- "/Applications/Momo Whisper.app/Contents/MacOS/momo-mcp"
  ```
- **Codex CLI** (`~/.codex/config.toml`):
  ```toml
  [mcp_servers.momo-whisper]
  command = "/Applications/Momo Whisper.app/Contents/MacOS/momo-mcp"
  ```
- **VS Code** (Command Palette → "MCP: Open User Configuration"; key is `servers`):
  ```json
  { "servers": { "momo-whisper": { "type": "stdio", "command": "/Applications/Momo Whisper.app/Contents/MacOS/momo-mcp" } } }
  ```
- **Zed** (`settings.json`; key is `context_servers`):
  ```json
  { "context_servers": { "momo-whisper": { "command": "/Applications/Momo Whisper.app/Contents/MacOS/momo-mcp", "args": [] } } }
  ```
- **Continue** (`~/.continue/config.yaml`):
  ```yaml
  mcpServers:
    - name: momo-whisper
      type: stdio
      command: "/Applications/Momo Whisper.app/Contents/MacOS/momo-mcp"
      args: []
  ```
- **Goose** (`goose configure` → Add Extension → Command-line Extension, or `~/.config/goose/config.yaml`):
  ```yaml
  extensions:
    momo-whisper:
      name: Momo Whisper
      type: stdio
      cmd: "/Applications/Momo Whisper.app/Contents/MacOS/momo-mcp"
      args: []
      enabled: true
      timeout: 300
  ```
- **Warp:** Settings → Agents → MCP servers → + Add, paste the JSON above.

### What to ask
In Claude Code, Momo adds four slash commands (type `/mcp` to see them):

- `/mcp__momo-whisper__fix-my-words` — finds what Momo keeps mishearing and proposes fixes.
- `/mcp__momo-whisper__learn-my-names` — picks out names and terms you say often and adds them to the vocabulary.
- `/mcp__momo-whisper__review-dictionary` — checks your dictionary for duplicates or risky entries.
- `/mcp__momo-whisper__send-feedback` — drafts a note to Momo's maker; sent only after you approve.

In any other app, just ask, for example:

- "Check my Momo history from the last 3 days and fix the words it keeps mishearing — show me the list first."
- "Find names and terms I say often in my Momo history and add them to Momo's vocabulary — ask me first."
- "Review my Momo dictionary for duplicates or risky entries and suggest fixes — don't change anything until I approve."

Your AI always shows the changes first. Nothing is saved until you approve.

### What your AI can and can't do
Tools: `recent_dictations`, `get_dictionary`, `add_correction`, `add_vocabulary`, `remove_correction`, `send_feedback`.

It **can**:
- Read your dictation history and your dictionary.
- Add corrections and words to listen for. They show as "Added by your AI" in Settings → Dictionary, where you can remove any of them.
- Remove its own entries. Your own entries are removed only after you click Remove in the dialog Momo shows you.
- Send feedback to Momo's maker — only after you approve it.

It **can't**:
- Change the app, your settings, prompts or keys.
- Run commands or touch other files.
- Reach the internet — except sending feedback you approve.

It runs on your Mac only. What your AI reads goes to that AI's provider, like any chat.

## Links
- Home: https://nabhak.github.io/Momo-Whisper/
- Install guide (web page): https://nabhak.github.io/Momo-Whisper/install.html
- Summary for AI: https://nabhak.github.io/Momo-Whisper/llms.txt
- Feedback: https://nabhak.github.io/Momo-Whisper/feedback.html
- All releases: https://github.com/Nabhak/Momo-Whisper/releases

Momo Whisper is free to use (proprietary freeware), built on the open-source WhisperApp by Gamezxz (MIT).
