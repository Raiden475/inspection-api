# Inspection API

API REST para gestión de formularios de inspección de empresas.

## Stack
- **Node.js + Express**
- **Sequelize ORM** con **MariaDB**
- **Multer** para manejo de imágenes adjuntas

## Configuración

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar base de datos
cp .env.example .env
# Editar .env con tus credenciales de MariaDB

# 3. Crear la base de datos en MariaDB (DBeaver u otro cliente)
# Crear una base de datos llamada inspection_db con charset utf8mb4 y collation utf8mb4_unicode_ci

# 4. Levantar el servidor (sincroniza las tablas automáticamente)
pnpm start
```

## Variables de entorno (.env)

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=inspection_db
DB_USER=root
DB_PASS=tu_password
```

## Importar base de datos con datos de prueba

```bash
mysql -u root -p inspection_db < dump-inspection_db-202606150635.sql
```

---

## Modelo de datos
FormTemplate (Plantilla de formulario)
└── revision: número de versión (1, 2, 3...)
└── status: active | obsolete
└── templateGroupId: agrupa revisiones del mismo formulario
└── Category[] (ordenadas por order)
└── Question[] (ordenadas por order)

Company (Empresa inspeccionada)
InspectionReport (Formulario realizado)
└── → FormTemplate (con su revisión específica)
└── → Company
└── Answer[] (una por pregunta)
└── value: "cumple" | "no_cumple" | "na"
└── imagePath: ruta de imagen opcional (máx. 1)
└── observation: texto libre
---

## Endpoints

### Empresas

#### `POST /api/companies`
Crear empresa.
```json
{
  "name": "Empresa S.A.",
  "cuit": "30-12345678-9",
  "address": "Av. Siempreviva 742"
}
```

#### `GET /api/companies`
Listar todas las empresas.

---

### Formularios (Plantillas)

#### `POST /api/form-templates`
Crea un formulario nuevo con categorías y preguntas.

```json
{
  "name": "Formulario de Seguridad e Higiene",
  "categories": [
    {
      "title": "Instalaciones Eléctricas",
      "order": 1,
      "questions": [
        { "text": "¿Los tableros eléctricos están señalizados?", "order": 1 },
        { "text": "¿Las instalaciones tienen puesta a tierra?", "order": 2 }
      ]
    },
    {
      "title": "Matafuegos",
      "order": 2,
      "questions": [
        { "text": "¿Los matafuegos están vigentes?", "order": 1 },
        { "text": "¿Están ubicados en lugares accesibles?", "order": 2 }
      ]
    }
  ]
}
```

**Respuesta `201`:** El formulario creado con todas sus categorías y preguntas.

---

#### `POST /api/form-templates/:id/new-revision`
Crea una nueva revisión del formulario. El formulario anterior queda con `status: "obsolete"`.

Acepta el mismo body que la creación. Puede cambiar el nombre y la estructura completa.

**Respuesta `201`:**
```json
{
  "message": "Nueva revisión creada. La revisión 1 fue marcada como obsoleta.",
  "formTemplate": { ... }
}
```

---

#### `GET /api/form-templates`
Lista todos los formularios.

| Query param | Valores | Descripción |
|---|---|---|
| `status` | `active` \| `obsolete` | Filtrar por estado |
| `groupId` | número | Ver todas las revisiones de un formulario |

Ejemplos:
- `GET /api/form-templates?status=active` — solo activos
- `GET /api/form-templates?groupId=1` — todas las revisiones del formulario 1

---

#### `GET /api/form-templates/:id`
Obtiene un formulario con categorías y preguntas ordenadas.

---

### Formularios realizados (Reportes de inspección)

#### `POST /api/inspection-reports`
Carga un formulario realizado. Acepta `multipart/form-data` para adjuntar imágenes.

**Campos de texto** (JSON o form-data):

| Campo | Tipo | Requerido |
|---|---|---|
| `formTemplateId` | número | ✅ |
| `companyId` | número | ✅ |
| `inspectionDate` | fecha YYYY-MM-DD | ✅ |
| `inspectorName` | string | ❌ |
| `notes` | string | ❌ |
| `answers` | JSON string o array | ❌ |

**Campo `answers`** (array JSON):
```json
[
  { "questionId": 1, "value": "cumple", "observation": "" },
  { "questionId": 2, "value": "no_cumple", "observation": "Sin señalización visible" },
  { "questionId": 3, "value": "na" }
]
```

**Valores válidos para `value`:** `cumple` | `no_cumple` | `na`

**Imágenes adjuntas** (multipart): campo `image_<questionId>`, ej: `image_2` para la pregunta 2.
- Formatos: JPEG, PNG, GIF, WebP
- Máximo: 5 MB por imagen, 1 imagen por pregunta

**Nota:** No se puede cargar un reporte con un formulario `obsolete`.

---

#### `GET /api/inspection-reports/:id`
Devuelve el reporte completo (findOne):
- Datos de la empresa
- Formulario con su revisión
- Categorías y preguntas ordenadas
- Respuestas con imagen y observación por pregunta

---

#### `GET /api/inspection-reports`
Lista todos los reportes.

| Query param | Descripción |
|---|---|
| `companyId` | Filtrar por empresa |
| `formTemplateId` | Filtrar por formulario |

---

## Flujo de revisiones
Formulario Rev.1 (active) ──► Nueva revisión
│
├── Rev.1 pasa a "obsolete"
└── Rev.2 creada como "active"

Los reportes cargados con Rev.1 conservan su referencia histórica.
No se puede cargar un nuevo reporte usando un formulario obsoleto.
## Pruebas

La colección de Postman con todos los endpoints probados se encuentra en:
`Inspection API.postman_collection.json`

Importala en Postman desde **File → Import** y ejecutá las requests en orden:
1. POST Crear empresa
2. POST Crear formulario
3. POST Cargar reporte de inspección
4. GET Obtener reporte completo
5. POST Nueva revisión del formulario