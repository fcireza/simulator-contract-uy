# Specifications: Chatbot Burbuja (NotebookLM-like)

## 1. Resumen Ejecutivo

Agregar un chatbot flotante (burbuja) en la esquina inferior derecha, disponible en **todas las páginas**, que permite al usuario subir un archivo `.md` con referencias web, configurar una API key de OpenAI (desde `.env` o override opcional), y chatear con contexto inyectado del archivo.

---

## 2. Requisitos

### 2.1. UI (Burbuja Flotante)
- [ ] Burbuja visible en **todas las páginas** (Simulador, Guía, Acerca)
- [ ] Posición: inferior-derecha (fixed, bottom-right)
- [ ] Click en burbuja → expande ventana de chat
- [ ] Botón para cerrar/minimizar la ventana

### 2.2. Carga de Archivo (`.md`)
- [ ] Input para subir archivo `.md` con referencias
- [ ] Uso de `FileReader` API (nativo, sin dependencias)
- [ ] El texto del `.md` se inyecta como contexto en el system prompt
- [ ] Mostrar nombre del archivo cargado

### 2.3. API Key (`.env`)
- [ ] **Fuente principal**: `.env` → `import.meta.env.VITE_OPENAI_API_KEY`
- [ ] **Override opcional**: Usuario puede poner su propia key en la UI
- [ ] Advertencia: "La API key del .env es visible en el código client-side"
- [ ] Si no hay key (ni .env ni usuario), mostrar error

### 2.4. Chat Interface
- [ ] Lista de mensajes (user + assistant)
- [ ] Input para preguntas del usuario
- [ ] Renderizado de Markdown en respuestas (`react-markdown`)
- [ ] Persistencia de mensajes en `localStorage`
- [ ] Indicador de "typing..." mientras carga

### 2.5. Context Injection
- [ ] El contenido del `.md` se pasa como contexto en el system prompt
- [ ] La IA debe responder **solo basándose en las fuentes** subidas
- [ ] Si no hay `.md` subido, usar conocimiento general (con advertencia)

---

## 3. Escenarios de Usuario

### Escenario 1: Uso con API key del sitio (`.env`)
1. El sitio tiene `VITE_OPENAI_API_KEY` en `.env`
2. Usuario entra a cualquier página
3. Hace clic en la burbuja (inferior-derecha)
4. Sube un archivo `.md` con referencias
5. Chatea con la IA sobre el contenido
6. **Costo**: Corre por cuenta del sitio

### Escenario 2: Usuario con su propia API key (privacy)
1. Usuario entra a la app
2. Hace clic en la burbuja
3. Va a "Configuración" y pone su propia API key
4. Sube su `.md` con fuentes
5. Chatea con la IA
6. **Costo**: Usuario paga (su propia key)

### Escenario 3: Archivo `.md` muy grande
1. Usuario sube un `.md` de 500KB
2. El sistema trunca el contenido a ~400K caracteres (límite GPT-4o)
3. Se muestra warning: "Archivo truncado por límite de contexto"

---

## 4. Criterios de Aceptación

- [ ] Burbuja visible y funcional en todas las páginas
- [ ] `.md` upload funciona correctamente (FileReader)
- [ ] Usa `import.meta.env.VITE_OPENAI_API_KEY` como default
- [ ] Usuario puede hacer override de la key en UI
- [ ] Advertencia clara sobre visibilidad de `.env` key
- [ ] Chat funciona con inyección de contexto
- [ ] Renderizado de Markdown en respuestas
- [ ] Mensajes persisten en `localStorage`
- [ ] Build y tests (67/67) siguen pasando

---

## 5. Dependencias Nuevas

```bash
npm install react-markdown
```

**Total nuevo peso**: ~5KB (gzip)

---

## 6. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| API key de `.env` visible en client bundle | Advertir al usuario claramente |
| Archivo `.md` excede context window | Truncar con warning |
| OpenAI bloquea CORS | Solo usar GPT-4o-mini (confirmado funcional) |
| Costos de API para el sitio | Mostrar costo estimado por mensaje |
| Sin backend = sin protección server-side | Diseño es client-side only |

---

## 7. Notas Técnicas

- **Vite `.env` behavior**: `VITE_` prefixed vars se inyectan en el bundle en tiempo de build
- **OpenAI CORS**: Solo OpenAI permite llamadas directas desde browser (Anthropic no)
- **Modelo recomendado**: `gpt-4o-mini` (más barato, suficiente para chat)
- **Storage**: `localStorage` para mensajes y API key override
