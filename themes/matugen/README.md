# Tema Matugen para Spicetify

Tema dinamico para Spotify basado en la paleta de colores Material You (Material Design 3) generada por Matugen a partir del fondo de pantalla actual.

---

## 1. Filosofia de Diseno

A diferencia de implementaciones como Sleek (que rediseñan la interfaz, alteran la disposicion de paneles y modifican tamanos de elementos), este tema se centra exclusivamente en:

* **Esquema de color limpio y coherente:** Adaptacion fidedigna de los roles de color semanticos de Material Design 3 sobre la interfaz vanilla de Spotify (XPUI).
* **Cero cambios invasivos de maquetacion:** Preserva el layout oficial, la responsividad y todos los controles originales del reproductor.
* **Sincronizacion en tiempo real:** Se regenera automaticamente cada vez que Matugen actualiza la paleta del sistema con un nuevo fondo de pantalla.

---

## 2. Arquitectura de Integracion

El flujo de generacion y aplicacion del tema funciona de la siguiente manera:

```text
Fondo de Pantalla (~/.config/themes/current/wallpaper)
                    |
                    v
             [ matugen image ]
                    |
                    v (procesa ~/.config/matugen/templates/spicetify.ini)
~/.config/themes/current/spicetify.ini
                    |
                    v (enlace simbolico)
~/Workspace/personal/spicetify/themes/matugen/color.ini
                    |
                    v (enlace simbolico a Themes de Spicetify)
~/.config/spicetify/Themes/matugen/
                    ├── color.ini -> ~/.config/themes/current/spicetify.ini
                    └── user.css  -> Estilos adaptativos de color
```

---

## 3. Instalacion y Activacion

### Paso 1: Enlazar el tema a Spicetify
Crea el enlace simbolico en el directorio de temas de Spicetify:

```bash
ln -sfn "$HOME/Workspace/personal/spicetify/themes/matugen" "$HOME/.config/spicetify/Themes/matugen"
```

### Paso 2: Configurar Spicetify
Establece `matugen` como el tema activo y selecciona el esquema de colores correspondiente:

```bash
spicetify config current_theme matugen
spicetify config color_scheme matugen
spicetify config inject_css 1 replace_colors 1
```

### Paso 3: Aplicar Cambios
Aplica la configuracion al cliente de Spotify:

```bash
spicetify apply
```

---

## 4. Mapeo de Roles de Color Material Design 3

La plantilla `spicetify.ini` vincula los roles de Matugen a las variables de Spicetify:

| Variable Spicetify | Rol de Matugen | Proposito en Spotify |
| :--- | :--- | :--- |
| `main` | `surface` | Fondo principal de la vista de navegacion |
| `sidebar` | `surface_container_lowest` | Barra lateral izquierda (Tu Biblioteca) |
| `player` | `surface_container_low` | Barra inferior del reproductor |
| `card` | `surface_container` | Tarjetas de albumes, listas y artistas |
| `text` | `on_surface` | Texto primario y titulos |
| `subtext` | `on_surface_variant` | Metadatos, artistas secundarios y duraciones |
| `button` | `primary` | Boton de reproduccion, sliders activos y acentos |
| `button-active` | `primary_container` | Hover en botones interactivos |
| `button-disabled` | `outline_variant` | Barra de progreso y volumen inactivas |
| `notification-error` | `error` | Estados criticos y errores |

---

## 5. Actualizacion Dinamica con Fondos de Pantalla

Cuando se ejecuta `apply-matugen.sh` (por ejemplo, desde el selector de wallpapers en Quickshell), el script reescribe `~/.config/themes/current/spicetify.ini` y ejecuta automaticamente:

```bash
spicetify apply -n
```

El flag `-n` permite actualizar el tema de Spotify sin necesidad de reiniciar la aplicacion.
