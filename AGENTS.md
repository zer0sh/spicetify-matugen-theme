# Agent Context and Guide: Development with Spicetify (AGENTS.md)

This document establishes the technical foundation, workflow, development conventions and architecture guidelines for any AI agent or developer working on Spotify extensions, custom apps (Custom Apps) and themes within this repository.

---

## 1. Overview and Goals

The goal of this workspace is the development, testing and distribution of custom components for the Spotify desktop client through **Spicetify CLI** and **Spicetify Creator**.

* **Repository path:** `~/Workspace/personal/spicetify/`
* **Active Spicetify configuration:** `~/.config/spicetify/`
* **Spicetify binary:** `~/.spicetify/spicetify`
* **Official reference documentation:** [Spicetify Creator Basics](https://spicetify.app/docs/development/spicetify-creator/the-basics)

---

## 2. Tools and Runtimes

* **Node / JS Runtimes:**
  * `bun` (preferred for fast execution and package installation)
  * `npm`, `yarn`, `pnpm` (available depending on compatibility with `create-spicetify-app`)
* **Bundler (esbuild):**
  * Spicetify Creator uses `esbuild` internally to bundle TypeScript and React into high-performance vanilla JavaScript that can be injected into Spotify.
* **Style Preprocessors:**
  * Native support for CSS, SCSS, Sass, PostCSS and CSS Modules (`*.module.css` / `*.module.scss`).

---

## 3. Workspace Directory Structure

```text
~/Workspace/personal/spicetify/
├── AGENTS.md        # This technical guide and agent context
├── README.md        # General repository description
├── apps/            # Complete custom apps (Custom Apps with React)
├── extensions/      # TypeScript/JavaScript scripts and extensions
└── themes/          # CSS stylesheets and color palettes (user.css, color.ini)
```

---

## 4. Spicetify Creator: Project Types and Creation

### Project Scaffolding with `create-spicetify-app`

To generate a new interactive base project inside `apps/` or `extensions/`:

```bash
# With npm/npx
npx create-spicetify-app

# With yarn
yarn create spicetify-app

# With pnpm
pnpm create spicetify-app
```

The wizard asks for:
1. Project / directory name.
2. Component type: `Extension` or `Custom App`.
3. Whether to generate interactive sample code.

---

## 5. Component Architecture

### A. Extensions (Runtime Scripts)

An extension is injected when Spotify starts and runs in the background over the global interface.

* **Typical project structure (`extensions/<name>/`):**
  * `src/app.tsx` or `src/app.ts`: Main entry point. Exports a function or async block executed at startup.
  * `src/settings.json`: Minimal configuration file:
    ```json
    {
      "nameId": "my-extension"
    }
    ```
  * `src/types/`: TypeScript definitions and Spicetify global types.

* **Mandatory initialization pattern:**
  Spotify loads the Spicetify APIs asynchronously. Extensions must wait for the object to be available before invoking methods:
  ```typescript
  (async () => {
    while (!Spicetify?.showNotification) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    Spicetify.showNotification('Extension loaded successfully');
  })();
  ```

### B. Custom Apps

A custom app is a single-page application (SPA) built with React that is embedded within Spotify's main navigation.

* **Typical project structure (`apps/<name>/`):**
  * `src/app.tsx`: Main React component exported by default, mounted when entering the application.
  * `src/settings.json`: Metadata for the navigation sidebar:
    ```json
    {
      "displayName": "My App",
      "nameId": "my-app",
      "icon": "css/icon.svg",
      "activeIcon": "css/icon.svg"
    }
    ```
  * `src/extensions/extension.tsx`: Secondary extension used to listen to global events or register shortcuts.
  * `src/css/`: Modular stylesheets (`app.module.scss`) and SVG icons.

### C. Themes (`themes/`)

* Folder containing `user.css` and optionally `color.ini`.
* Supports CSS rules to modify the player interface, library, headers and panels.
* Compatible with dynamically injected color variables (e.g. from theme generators or Matugen).

---

## 6. Styles, Packages and Plugins Handling

### Style Injection
* **Global CSS / SCSS:**
  ```typescript
  import './styles.css';
  import './styles.scss';
  ```
* **CSS Modules (avoids class name collisions in Spotify's DOM):**
  ```typescript
  import styles from './component.module.scss';
  // Usage: <div className={styles.container}>...</div>
  ```

### Node Packages
Any npm package can be installed in the subproject and `esbuild` will bundle it into the final output:
```bash
bun add <package>
# or npm install <package>
```

### Official Spicetify Creator Plugins
Official plugins follow the `spcr-<name>` convention (e.g. `spcr-settings`, `spcr-navigation`):
```bash
npm install spcr-settings
```

---

## 7. Build, Watch and Testing Cycle

Inside any Spicetify Creator project folder:

### 1. Build into Spicetify
```bash
npm run build
# Bundles and automatically installs the output into ~/.config/spicetify/Extensions/ or CustomApps/
```

### 2. Local Build
```bash
npm run build-local
# Generates the bundled output in the local ./dist/ folder (useful for commits and inspection)
```

### 3. Registration via Spicetify CLI
```bash
# For Extensions
spicetify config extensions <nameId>.js
spicetify apply

# For Custom Apps
spicetify config custom_apps <nameId>
spicetify apply
```

### 4. Watch Mode (Live Development / Live Reload)
1. In one terminal, start the compiler in watch mode:
   ```bash
   npm run watch
   ```
2. In another terminal, start Spotify in reactive watch mode:
   ```bash
   # For Extensions
   spicetify watch -le

   # For Custom Apps
   spicetify watch -la
   ```

---

## 8. Spicetify API Summary

The Spotify environment exposes `window.Spicetify` globally with advanced utilities:

* `Spicetify.Player`: Playback control (`play()`, `pause()`, `next()`, `addEventListener('songchange')` events).
* `Spicetify.Platform`: Access to `History` (SPA route navigation), CosmosAsync, GraphQL client.
* `Spicetify.showNotification(message)`: Native notification banners.
* `Spicetify.ContextMenu`: Register items in the right-click menu of tracks, playlists and artists.
* `Spicetify.Topbar`: Buttons and menus anchored to the top bar.
* `Spicetify.ReactComponent` and `Spicetify.ReactHook`: Internal Spotify components (Icons, Tooltips, Sliders, Confirmation Dialogs).

---

## 9. Mandatory Rules and Conventions for Agents

1. **No Emojis:**
   * Including emojis in source files, configuration files, branch names, commit messages or documentation is strictly prohibited.
2. **Languages:**
   * This repository is public: all repository documentation (README, AGENTS, theme docs) must be written in English.
   * Obsidian vault documentation (`~/Workspace/vault/`): in Spanish.
   * Commit messages and technical code/variable names: in English.
3. **Clean Commits:**
   * Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).
4. **Safety and Backups:**
   * Never modify Spotify's raw binary files unless Spicetify has generated its backup (`spicetify backup apply`).
   * To revert any Spotify client failure: `spicetify restore`.
5. **Dependency Isolation:**
   * Each complex app or extension must keep its own `package.json` and `tsconfig.json` inside its subdirectory in `apps/` or `extensions/`.
