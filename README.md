# 🗓️ Agendaku

MVP para tandas digitales.

---

## 📋 Descripción

**Agendaku** es una API REST para organizar tandas (cuentas rotativas grupales) de forma digital y transparente. Incluye:

- Sorteo aleatorio y trazable de turnos
- Registro de aportes mensuales con validación
- Recordatorios automáticos (simulados)
- Entrega del dinero al beneficiario cuando todos aportan
- Resumen final del ciclo

---

## 🚀 Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/agendaku.git
cd agendaku
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

### 5. Ejecutar en producción

```bash
npm start
```

La API estará disponible en: `http://localhost:3000`

---

## 📡 Endpoints

### `GET /`
Muestra todos los endpoints disponibles.

---

### `POST /api/tanda`
Crea una nueva tanda con sorteo aleatorio de turnos.

**Body:**
```json
{
  "participantes": ["Ana", "Luis", "María", "Carlos"],
  "montoPorTurno": 500,
  "descripcion": "Tanda familiar enero"
}
```

---

### `GET /api/tanda`
Consulta el estado actual de la tanda activa.

---

### `POST /api/tanda/aporte`
Registra el aporte de un participante en el mes actual.

**Body:**
```json
{
  "nombre": "Ana"
}
```

---

### `GET /api/tanda/resumen`
Devuelve el resumen completo del historial del ciclo.

---

### `DELETE /api/tanda`
Elimina la tanda activa para crear una nueva.

---

## ☁️ Despliegue en Vercel

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Iniciar sesión y desplegar

```bash
vercel login
vercel
vercel --prod
```

---

## 🧪 Flujo de prueba rápida

```bash
# 1. Crear tanda
curl -X POST http://localhost:3000/api/tanda \
  -H "Content-Type: application/json" \
  -d '{"participantes":["Ana","Luis","María"],"montoPorTurno":300}'

# 2. Registrar aportes
curl -X POST http://localhost:3000/api/tanda/aporte \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana"}'

# 3. Ver estado
curl http://localhost:3000/api/tanda

# 4. Ver resumen final
curl http://localhost:3000/api/tanda/resumen
```

---

## 📁 Estructura del proyecto

```
agendaku/
├── index.js                  # Servidor principal
├── package.json
├── vercel.json               # Configuración despliegue
├── .env.example
├── .gitignore
├── data/
│   └── store.js              # Estado en memoria
├── controllers/
│   └── tanda.controller.js   # Lógica de negocio
└── routes/
    └── tanda.routes.js
```

---

## 📄 Licencia

MIT © Agendaku
