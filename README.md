# Twilio Studio Flow Visualizer

## Descripción

Esta extensión permite visualizar y editar los flujos de Twilio Studio directamente en el editor de código, sin necesidad de desplegar los cambios en la plataforma de Twilio para ver su aspecto visual.

## Características

- **Visualización de flujos**: Representación gráfica de los flujos de Twilio Studio basada en los archivos JSON de configuración.
- **Edición de widgets**: Interfaz para modificar estados (widgets) específicos dentro del flujo.
- **Vista previa en tiempo real**: Actualización instantánea de la visualización al modificar el código JSON.
- **Exportación de cambios**: Capacidad para guardar los cambios realizados de vuelta al archivo JSON.

## Instalación

1. Asegúrate de tener Node.js instalado (versión 14 o superior)
2. Clona este repositorio o copia la carpeta del plugin
3. Navega a la carpeta del plugin e instala las dependencias:

```bash
cd plugins/pg-studio-flow-visualizer
npm install
```

4. Inicia el servidor de desarrollo:

```bash
npm start
```

## Uso

### Visualización de un flujo

1. Abre la extensión en tu navegador (por defecto en http://localhost:8080)
2. Selecciona el archivo JSON del flujo que deseas visualizar
3. El flujo se mostrará gráficamente con todos sus estados y transiciones

### Edición de un widget

1. Haz clic en el widget (estado) que deseas editar
2. Se abrirá un panel lateral con todas las propiedades del widget
3. Modifica los valores según sea necesario
4. Guarda los cambios para actualizar el archivo JSON

## Estructura del proyecto

```
pg-studio-flow-visualizer/
├── src/
│   ├── components/       # Componentes React
│   ├── utils/            # Utilidades y funciones auxiliares
│   ├── services/         # Servicios para manejar archivos y datos
│   ├── styles/           # Estilos CSS
│   ├── App.js            # Componente principal
│   └── index.js          # Punto de entrada
├── public/               # Archivos estáticos
├── package.json          # Dependencias y scripts
└── README.md             # Documentación
```

## Tecnologías utilizadas

- React.js para la interfaz de usuario
- React Flow Renderer para la visualización de diagramas
- D3.js para gráficos avanzados
- React JSON Editor para la edición de propiedades

## Contribución

Si deseas contribuir a este proyecto, por favor:

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.