# Agendaku 
Quiero crear un MVP llamado Agendaku usando Gemini CLI. 
El flujo debe cubrir:

1. Inicialización del proyecto
   - Crear carpeta Agendaku
   - Inicializar con npm init -y
   - Instalar dependencias básicas (express, dotenv, nodemon)

2. Configuración del servidor
   - Crear archivo index.js
   - Configurar servidor Express con rutas:
     - POST /api/tanda → crear grupo con participantes, monto y duración
     - GET /api/tanda → consultar configuración actual

3. Funcionalidad principal
   - Sorteo de turnos aleatorio y transparente
   - Registro de aportes mensuales con validación
   - Recordatorios automáticos (simulados en MVP)
   - Entrega del dinero al beneficiario cuando todos aportan
   - Resumen final del ciclo al terminar

4. Integración con Gemini
   - Usar GEMINI_API_KEY como variable de entorno
   - Endpoint /api/ai que reciba texto y devuelva respuesta de Gemini

5. Despliegue con URL pública
   - Configurar proyecto para despliegue en Vercel o Render
   - Incluir script start en package.json
   - Probar localmente y luego desplegar

6. Documentación README.md
   - Nombre del proyecto: Agendaku
   - Descripción breve: MVP para tandas digitales
   - Instrucciones de instalación y ejecución
   - Uso de endpoints principales
   - Pasos para despliegue en Vercel
   - Licencia MIT

Objetivo: obtener un MVP funcional con endpoints claros, trazabilidad del ciclo de tanda, integración con Gemini, despliegue público y documentación en README.md para GitHub.
