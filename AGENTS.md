# Contexto y Guia de Agentes: Desarrollo con Spicetify (AGENTS.md)

Este documento establece la base tecnica, flujo de trabajo, convenciones de desarrollo y pautas de arquitectura para cualquier agente de IA o desarrollador que trabaje en extensiones, aplicaciones personalizadas (Custom Apps) y temas de Spotify dentro de este repositorio.

---

## 1. Descripcion General y Objetivos

El objetivo de este espacio es el desarrollo, prueba y distribucion de componentes personalizados para el cliente de escritorio de Spotify mediante **Spicetify CLI** y **Spicetify Creator**.

* **Ruta del repositorio:** `~/Workspace/personal/spicetify/`
* **Configuracion activa de Spicetify:** `~/.config/spicetify/`
* **Binario de Spicetify:** `~/.spicetify/spicetify`
* **Documentacion oficial de referencia:** [Spicetify Creator Basics](https://spicetify.app/docs/development/spicetify-creator/the-basics)

---

## 2. Herramientas y Runtimes

* **Runtimes de Node / JS:**
  * `bun` (preferido para ejecucion rapida e instalacion de paquetes)
  * `npm`, `yarn`, `pnpm` (disponibles segun compatibilidad con `create-spicetify-app`)
* **Compilador (esbuild):**
  * Spicetify Creator utiliza `esbuild` internamente para empaquetar TypeScript y React a JavaScript vanilla de alto rendimiento inyectable en Spotify.
* **Preprocesadores de Estilos:**
  * Soporte nativo para CSS, SCSS, Sass, PostCSS y CSS Modules (`*.module.css` / `*.module.scss`).

---

## 3. Estructura de Directorios del Espacio

```text
~/Workspace/personal/spicetify/
├── AGENTS.md        # Esta guia tecnica y contexto del agente
├── README.md        # Descripcion general del repositorio
├── apps/            # Aplicaciones personalizadas completas (Custom Apps con React)
├── extensions/      # Scripts y extensiones en TypeScript/JavaScript
└── themes/          # Hojas de estilo CSS y paletas de color (user.css, color.ini)
```

---

## 4. Spicetify Creator: Tipos de Proyectos y Creacion

### Inicializacion con `create-spicetify-app`

Para generar un nuevo proyecto base interactivo dentro de `apps/` o `extensions/`:

```bash
# Con npm/npx
npx create-spicetify-app

# Con yarn
yarn create spicetify-app

# Con pnpm
pnpm create spicetify-app
```

El asistente solicita:
1. Nombre del proyecto / directorio.
2. Tipo de componente: `Extension` o `Custom App`.
3. Opcion de generar codigo de ejemplo interactivo.

---

## 5. Arquitectura de Componentes

### A. Extensiones (Scripts en Tiempo de Ejecucion)

Una extension se inyecta al iniciar Spotify y opera de fondo sobre la interfaz global.

* **Estructura tipica de proyecto (`extensions/<nombre>/`):**
  * `src/app.tsx` o `src/app.ts`: Punto de entrada principal. Exporta una funcion o bloque asincrono ejecutado al inicio.
  * `src/settings.json`: Archivo de configuracion minima:
    ```json
    {
      "nameId": "mi-extension"
    }
    ```
  * `src/types/`: Definiciones TypeScript y tipos globales de Spicetify.

* **Patron obligatorio de inicializacion:**
  Spotify carga asincronamente las APIs de Spicetify. Las extensiones deben esperar a que el objeto este disponible antes de invocar metodos:
  ```typescript
  (async () => {
    while (!Spicetify?.showNotification) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    Spicetify.showNotification('Extension cargada correctamente');
  })();
  ```

### B. Aplicaciones Personalizadas (Custom Apps)

Una Custom App es una aplicacion de una sola pagina (SPA) construida en React que se incrusta dentro de la navegacion principal de Spotify.

* **Estructura tipica de proyecto (`apps/<nombre>/`):**
  * `src/app.tsx`: Componente React principal exportado por defecto que se monta al entrar a la aplicacion.
  * `src/settings.json`: Metadatos para la barra lateral de navegacion:
    ```json
    {
      "displayName": "Mi App",
      "nameId": "mi-app",
      "icon": "css/icon.svg",
      "activeIcon": "css/icon.svg"
    }
    ```
  * `src/extensions/extension.tsx`: Extension secundaria asociada para escuchar eventos globales o registrar accesos directos.
  * `src/css/`: Hojas de estilo modulares (`app.module.scss`) e iconos SVG.

### C. Temas (`themes/`)

* Carpeta con `user.css` y opcionalmente `color.ini`.
* Soporta reglas CSS para modificar la interfaz del reproductor, libreria, encabezados y paneles.
* Compatible con variables de color inyectadas dinamicamente (ej. por generadores de temas o Matugen).

---

## 6. Manejo de Estilos, Paquetes y Plugins

### Inyeccion de Estilos
* **CSS / SCSS global:**
  ```typescript
  import './estilos.css';
  import './estilos.scss';
  ```
* **CSS Modules (evita colisiones de clases en el DOM de Spotify):**
  ```typescript
  import styles from './componente.module.scss';
  // Uso: <div className={styles.contenedor}>...</div>
  ```

### Paquetes de Node
Cualquier paquete npm puede instalarse en el subproyecto y `esbuild` lo integrara en el bundle final:
```bash
bun add <paquete>
# o npm install <paquete>
```

### Plugins Oficiales de Spicetify Creator
Los plugins oficiales siguen la convencion `spcr-<nombre>` (ej. `spcr-settings`, `spcr-navigation`):
```bash
npm install spcr-settings
```

---

## 7. Ciclo de Compilacion, Watch y Pruebas

Dentro de la carpeta de cualquier proyecto de Spicetify Creator:

### 1. Compilacion hacia Spicetify
```bash
npm run build
# Compila e instala automaticamente el bundle en ~/.config/spicetify/Extensions/ o CustomApps/
```

### 2. Compilacion Local
```bash
npm run build-local
# Genera el output compilado en la carpeta ./dist/ local (util para commits e inspeccion)
```

### 3. Registro en Spicetify CLI
```bash
# Para Extensiones
spicetify config extensions <nameId>.js
spicetify apply

# Para Custom Apps
spicetify config custom_apps <nameId>
spicetify apply
```

### 4. Modo Watch (Desarrollo en Vivo / Live Reload)
1. En una terminal, iniciar el compilador en modo escucha:
   ```bash
   npm run watch
   ```
2. En otra terminal, iniciar Spotify en modo escucha reactiva:
   ```bash
   # Para Extensiones
   spicetify watch -le

   # Para Custom Apps
   spicetify watch -la
   ```

---

## 8. Resumen de APIs de Spicetify

El entorno de Spotify expone globalmente `window.Spicetify` con utilidades avanzadas:

* `Spicetify.Player`: Control de reproduccion (`play()`, `pause()`, `next()`, eventos `addEventListener('songchange')`).
* `Spicetify.Platform`: Acceso a `History` (navegacion por rutas SPA), CosmosAsync, cliente GraphQL.
* `Spicetify.showNotification(mensaje)`: Banners nativos de notificacion.
* `Spicetify.ContextMenu`: Registro de elementos en el menu click derecho de pistas, listas y artistas.
* `Spicetify.Topbar`: Botones y menus anclados a la barra superior.
* `Spicetify.ReactComponent` y `Spicetify.ReactHook`: Componentes internos de Spotify (Iconos, Tooltips, Sliders, Dialogos de confirmacion).

---

## 9. Reglas y Convenciones Obligatorias para Agentes

1. **Sin Emojis:**
   * Prohibido estrictamente incluir emojis en archivos de codigo, archivos de configuracion, nombres de ramas, mensajes de commit o documentacion.
2. **Idiomas:**
   * Documentacion del repositorio y boveda de Obsidian: en espanol.
   * Mensajes de commit y nombres de codigo/variables tecnicas: en ingles.
3. **Commits Limpios:**
   * Seguir Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).
4. **Seguridad y Respaldo:**
   * Nunca modificar archivos binarios directos de Spotify sin que Spicetify haya generado su respaldo (`spicetify backup apply`).
   * Para revertir cualquier falla en el cliente Spotify: `spicetify restore`.
5. **Aislamiento de Dependencias:**
   * Cada aplicacion o extension compleja debe mantener su propio `package.json` y `tsconfig.json` dentro de su subdirectorio en `apps/` o `extensions/`.
