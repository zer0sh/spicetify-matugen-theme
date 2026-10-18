# Spicetify Development

Workspace dedicated to the development, customization and maintenance of Spicetify components for Spotify.

---

## Directory Structure

* `apps/`: Custom Apps integrated into the Spotify client.
* `extensions/`: JavaScript scripts and extensions that add features and modify behavior.
* `themes/`: Custom themes, CSS stylesheets (`user.css`) and color definitions (`color.ini`).

---

## Spicetify CLI Workflow

To link and test the components developed in this workspace with the active Spicetify configuration (`~/.config/spicetify/`):

### Linking Extensions
```bash
ln -sf "$HOME/Workspace/personal/spicetify/extensions/<extension-name>.js" "$HOME/.config/spicetify/Extensions/"
spicetify config extensions <extension-name>.js
spicetify apply
```

### Linking Themes
```bash
ln -sfn "$HOME/Workspace/personal/spicetify/themes/<theme-name>" "$HOME/.config/spicetify/Themes/<theme-name>"
spicetify config current_theme <theme-name>
spicetify apply
```

### Linking Custom Apps
```bash
ln -sfn "$HOME/Workspace/personal/spicetify/apps/<app-name>" "$HOME/.config/spicetify/CustomApps/<app-name>"
spicetify config custom_apps <app-name>
spicetify apply
```

---

## Available Extensions

### Topbar Actions (`extensions/topbar-actions.js`)

* **Description:** Relocates the Spicetify utility button to the right side of the top bar (`.main-actionButtons`) and applies a custom flame icon to it.
* **Features:**
  * Automatic relocation of the Spicetify button (update notices and persistent info button with an environment modal).
  * Custom SVG flame icon for the Spicetify button.
  * Mutation observer to ensure persistence after internal navigations in the Spotify XPUI.
* **Marketplace note:** the `/marketplace` view is injected natively by Spicetify (`helper/spicetifyWrapper.js`, `custom-navlink` class) for every registered Custom App, so this extension does not manage that button.
