# 🚀 Proyecto Metodología del Desarrollo IECI 2025-1

Este repositorio contiene el proyecto semestral de Metodología del Desarrollo usando Node.js, Express y PostgreSQL. 

---

Grupo conformado por:

* Fabián Mora
* Jorge Díaz
* Fernanda Gonzalez
* Francisco Moya
* Juan Perez

---

**Tema asignado: Condominios**

Sigue estos pasos para clonar, configurar y ejecutar el servidor localmente.

---

## 📦 Requisitos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

- [Node.js](https://nodejs.org/) (versión 22.XX.X LTS)
- [PostgreSQL](https://www.postgresql.org/) (versión 16.X.X)
- [Git](https://git-scm.com/)

---

## 🔧 Clonar y ejecutar el proyecto

### 1. Clona el repositorio
```bash
git clone https://https://github.com/FabitoSimpsonYT/Proyecto-MDD-2025-1-Grupo3/
cd Proyecto-MDD-2025-1-Grupo3/
```

### 2. Accede a la carpeta backend e instala las dependencias
```bash
cd backend/
npm install
```

### 3. Renombra el archivo `.env.example` a `.env` y configura las variables de entorno
```bash
PORT = 3000

HOST = localhost
DB_USERNAME = NOMBRE_DE_USUARIO
PASSWORD = CONTRASEÑA
DATABASE = BASE_DE_DATOS

SESSION_SECRET = CODIGO_ULTRA_SECRETO_DE_JWT
```

### 4. Configura postgres
- Asegúrate de que tu base de datos tenga las mismas credenciales ingresadas en `.env`.

### 5. Inicia el servidor
```bash
npm start
```

El backend se ejecutará en http://localhost:3000.

------------------------------------------------------

## 💻 Ejecutar el frontend

### 1. Abre una nueva consola

Asegúrate de mantener corriendo el backend en la consola anterior.

### 2. Accede a la carpeta del frontend

```bash
cd frontend/
```

### 3. Instala las dependencias

```bash
npm install
```

### 4. Inicia la aplicación frontend

```bash
npm run dev
```

La aplicación se abrirá automáticamente en tu navegador, usualmente en `http://localhost:5173` (o el puerto que indique tu terminal).

