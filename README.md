# Fleet Tracker UI (Prueba Técnica)

## Descripción

Este proyecto es una prueba técnica que consiste en desarrollar un frontend para gestionar una flota de vehículos. La idea era demostrar conocimiento de React, TypeScript, state management y arquitectura de componentes, construyendo algo que se parezca a un sistema real de fleet tracking.

Lo que incluye:

- Listado y gestión de vehículos (crear, editar, eliminar)
- Listado y gestión de conductores
- Sistema de alertas (mantenimiento, combustible, velocidad, etc.)
- Gestión de rutas
- Un dashboard con un resumen general

## Decisiones de diseño

**UI/UX**

- Componentes propios sin depender de librerías de UI pre-hechas. Esto permite un diseño más controlado y adaptable.
- Phosphor Icons como librería de iconos por su variedad y consistencia visual.
- Estados de carga, modales de confirmación y manejo de errores para mejorar la experiencia de usuario.

**Patrones de componentes**

- Separación por responsabilidad: `ui/` para componentes genéricos reutilizables, `vehicles/` y `drivers/` para componentes específicos de cada dominio.
- Componentes de layout (`Header`, `InfoScreen`) compartidos en toda la aplicación.

## Decisiones arquitectónicas

**State Management**

- Zustand para manejar el estado global. Es más ligero que Redux y la curva de aprendizaje es menor, ideal para proyectos de este tamaño.
- Stores separados por dominio (vehicles, drivers, alerts, routes) para mantener todo organizado y escalable.

**Custom Hooks**

- Hooks que encapsulan la lógica de negocio (`useVehicles`, `useDrivers`, `useAlerts`, `useRoutes`).
- Esta capa de abstracción sobre los stores permite que los componentes no dependan directamente de Zustand, facilitando cambios futuros.

**API Layer**

- Axios como cliente HTTP para las peticiones al servidor.
- Configuración centralizada en `src/lib/api.ts` con la base URL.
- JSON-Server como API mock para desarrollo (corre en el puerto 4000).

**Estructura de carpetas**

```
src/
├── components/    # Componentes UI y específicos por dominio
├── hooks/         # Custom hooks de negocio
├── lib/           # Configuraciones y tipos
├── routes/        # Páginas de la aplicación
└── stores/        # Estado global con Zustand
```

## Tecnologías utilizadas

| Tecnología                  | Uso                                      |
| --------------------------- | ---------------------------------------- |
| **React 19.2.0**            | Framework principal                      |
| **TypeScript**              | Tipado estático y seguridad en el código |
| **Vite 7.3.1**              | Build tool y servidor de desarrollo      |
| **React Router DOM 7.13.0** | Enrutamiento del lado del cliente        |
| **Zustand 5.0.11**          | State management global                  |
| **Axios 1.13.5**            | Cliente HTTP para API calls              |
| **Phosphor Icons**          | Librería de iconos                       |
| **JSON-Server**             | API mock para desarrollo                 |

**Herramientas de desarrollo:**

- ESLint y Prettier para mantener el código limpio y formateado.

## Notas

**Sobre el wrapper de stores**

Creé custom hooks que envuelven los stores de Zustand (`useVehicles`, `useDrivers`, etc.) en lugar de que los componentes consuman los stores directamente. Esta capa de abstracción tiene dos ventajas principales: los componentes están más limpios y solo conocen la interfaz del hook, y si en el futuro necesitamos cambiar la tecnología de state management, solo tendríamos que modificar el hook sin afectar los componentes.

**Sobre la búsqueda en vehicles.ts**

Durante el desarrollo me encontré con que la versión beta de JSON-Server tiene limitaciones con las búsquedas complejas. Como ya estaba avanzado con el proyecto, no era viable hacer downgrade a una versión anterior. La solución fue implementar una búsqueda específica por placa usando query params: cuando hay un término de búsqueda (`q`), lo mapeo al campo `plate` de la URL.

Es importante mencionar que la búsqueda funciona solo por coincidencia exacta de placa, no por coincidencias parciales, debido a las limitaciones de JSON-Server en su versión beta. Lo ideal sería tener una búsqueda más flexible que permita encontrar vehículos por cualquier campo y con coincidencias parciales, pero esto requeriría una API con mejor soporte para queries o implementar la lógica de búsqueda en el frontend.

**Sugerencia para futuras pruebas**

Como comentario constructivo para mejorar la experiencia: creo que sería valioso que la prueba fuera 100% frontend. JSON-Server, aunque es útil para prototipos, consume tiempo de desarrollo y tiene comportamientos que cambian entre versiones. Usar una API real (aunque sea de prueba) permitiría enfocar el esfuerzo en demostrar habilidades de frontend y tener un tipado más preciso basado en la respuesta real del servidor.

## Cómo ejecutar el proyecto

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Iniciar la API mock** (en una terminal):

   ```bash
   npm run server
   ```

   Esto levanta JSON-Server en `http://localhost:4000`

3. **Iniciar el frontend** (en otra terminal):
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

**Otros comandos:**

```bash
npm run build      # Construir para producción
npm run preview    # Previsualizar el build
npm run lint       # Ejecutar ESLint
npm run prettier   # Formatear el código
```
