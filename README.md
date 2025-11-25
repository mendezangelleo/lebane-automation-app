# 🧪 lebane-automation-app  
Framework de Automatización E2E para Lebane

![Status](https://img.shields.io/badge/status-active-success)
![Tech](https://img.shields.io/badge/playwright-E2E-blueviolet)
![Language](https://img.shields.io/badge/typescript-✓-3178c6)
![CI](https://img.shields.io/badge/GitHub-Actions-black)

---

## 📌 1. Introducción

Este repositorio contiene un **framework de automatización de pruebas End-to-End (E2E)** desarrollado para validar los flujos críticos de la plataforma **Lebane**.

El framework está construido en **Playwright** y sigue el patrón **Page Object Model (POM)**, asegurando:

- Escalabilidad  
- Bajo acoplamiento  
- Reutilización de acciones y componentes  
- Lectura clara y mantenible de los test cases  

---

## 🎯 Flujos Cubiertos

### 🔐 Autenticación
- Login exitoso (`TC00`)

### 📁 Gestión de Proyectos
- Creación con campos obligatorios (`TC01`)
- Validación de campos vacíos (`TC02`)
- Validación de duplicidad (`TC03`)

### 🏷️ Gestión de Unidades
- Creación manual de unidades
- Eliminación de unidades y listas de precios
- Carga de plantillas (`TC07`–`TC09`, `TC02 Template`)

---

## ⚙️ 2. Tecnologías Utilizadas

| Tecnología              | Propósito                                                                 |
|-------------------------|---------------------------------------------------------------------------|
| **Playwright**          | Motor de automatización E2E para pruebas rápidas y robustas.             |
| **TypeScript**          | Lenguaje principal con tipado fuerte.                                    |
| **GitHub Actions**      | Integración continua para ejecución automática en múltiples navegadores. |
| **Page Object Model**   | Estructura escalable de selectores y acciones.                           |
| **Google Apps Script**  | Notificaciones por email y reportería avanzada tras el CI.               |

---

## 🚀 3. Primeros Pasos (Setup Local)

### 3.1. Prerrequisitos

- Node.js **18+** o **20+** (LTS recomendado)
- npm (incluido con Node.js)

### 3.2. Instalación

Clona el repositorio:
git clone https://github.com/mendezangelleo/lebane-automation-app.git
cd lebane-automation-app

Instala dependencias y navegadores de Playwright:
npm install
npx playwright install --with-deps

3.3. Configuración de Credenciales
Crea un archivo .env en la raíz del proyecto:
TEST_USER_EMAIL="tu_usuario@ejemplo.com"
TEST_USER_PASSWORD="tu_password_segura"

▶️ 4. Ejecución de Pruebas
4.1. Ejecutar toda la suite (todos los navegadores)
npx playwright test

4.2. Ejecutar con UI visible (modo debug)
npx playwright test --project=chromium --headed

4.3. Ejecutar un archivo específico
npx playwright test tests/projects/projects.spec.ts

☁️ 5. Integración Continua (CI/CD)
5.1. Ejecución automática y manual
Este repo utiliza GitHub Actions, con ejecución programada bajo las siguientes condiciones:

Automático → Cada push o pull request a main

Scheduled (cron) → Ejecución diaria para validar regresión
(configurable en .github/workflows/playwright.yml)

Manual → Desde la pestaña Actions, botón Run workflow

5.2. Reportería y Notificaciones
Al terminar el flujo de CI, el sistema:

Publica un reporte HTML interactivo en GitHub Pages (playwright-report/)

Envía un email automático a través de Google Apps Script, con:

Estado final de la suite

Navegadores ejecutados

Duración total

Error en caso de fallos

⚠️ Requisito
Debes configurar el secreto:
GAS_WEBAPP_URL
Con la URL del deploy de tu Google Apps Script.

📂 Estructura del Proyecto
txt
Copiar código
.
├── playwright.config.ts
├── package.json
├── tests/
│   ├── auth/
│   ├── projects/
│   └── units/
├── pages/
│   ├── login.page.ts
│   ├── projects.page.ts
│   └── units.page.ts
├── utils/
└── .github/
    └── workflows/
        └── playwright.yml
🤝 Contribuciones
¡Las contribuciones son bienvenidas!
Abrí un Issue o creá un Pull Request con tu mejora.

👨‍💻 Autor
Ángel Méndez — Senior QA Engineer
📧 mendezangelleo@gmail.com
🔗 GitHub: @mendezangelleo
🔗 LinkedIn: /in/angelmendez98
