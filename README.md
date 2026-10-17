# Spicetify Development

Espacio de trabajo dedicado al desarrollo, personalizacion y mantenimiento de componentes para Spicetify en Spotify.

---

## Estructura del Directorio

* `apps/`: Aplicaciones personalizadas (Custom Apps) integradas dentro del cliente de Spotify.
* `extensions/`: Scripts y extensiones en JavaScript para anadir funciones y modificar comportamientos.
* `themes/`: Temas personalizados, hojas de estilo CSS (`user.css`) y definiciones de color (`color.ini`).

---

## Flujo de Trabajo con Spicetify CLI

Para enlazar y probar los componentes desarrollados en este espacio con la configuracion activa de Spicetify (`~/.config/spicetify/`):

### Enlace de Extensiones
```bash
ln -sf "$HOME/Workspace/personal/spicetify/extensions/<nombre-extension>.js" "$HOME/.config/spicetify/Extensions/"
spicetify config extensions <nombre-extension>.js
spicetify apply
```

### Enlace de Temas
```bash
ln -sfn "$HOME/Workspace/personal/spicetify/themes/<nombre-tema>" "$HOME/.config/spicetify/Themes/<nombre-tema>"
spicetify config current_theme <nombre-tema>
spicetify apply
```

### Enlace de Aplicaciones Personalizadas
```bash
ln -sfn "$HOME/Workspace/personal/spicetify/apps/<nombre-app>" "$HOME/.config/spicetify/CustomApps/<nombre-app>"
spicetify config custom_apps <nombre-app>
spicetify apply
```
