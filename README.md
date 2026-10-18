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

---

## Extensiones Disponibles

### Topbar Actions (`extensions/topbar-actions.js`)

* **Descripcion:** Reubica el boton de utilidad de Spicetify al lado derecho de la barra superior (`.main-actionButtons`) y le aplica un icono de llama personalizado.
* **Caracteristicas:**
  * Reubicacion automatica del boton de Spicetify (avisos de actualizacion y boton informativo persistente con modal de entorno).
  * Icono SVG de llama propio para el boton de Spicetify.
  * Observador de mutaciones para asegurar persistencia tras navegaciones internas en Spotify XPUI.
* **Nota sobre Marketplace:** el acceso a la vista `/marketplace` lo inyecta nativamente Spicetify (`helper/spicetifyWrapper.js`, clase `custom-navlink`) para cada Custom App registrada, por lo que esta extension no gestiona ese boton.

