# Design: Chatbot Burbuja (NotebookLM-like)

## 1. Arquitectura

```
. env (VITE_OPENAI_API_KEY) → inyectado en build (client-side)
                       ↓
              ChatBubble (floating, bottom-right)
                       ↓
              ChatWindow (expanded view)
           /     |         \
  FileUpload  Messages  ApiKeyInput (override opcional)
                       ↓
                  useChat hook
               /           \
        FileReader API    OpenAI API call
        (leer .md)     (import.meta.env.VITE_*)
```

---

## 2. Estructura de Componentes

```
src/components/ChatBubble/
  index.tsx          # Burbuja flotante + toggle state
  ChatWindow.tsx     # Ventana expandida con chat
  FileUpload.tsx     # Upload de .md vía FileReader
  MessageList.tsx    # Lista de mensajes (user + bot)
  ApiKeyInput.tsx    # Input opcional para override de key
  useChat.ts         # Hook: mensajes + llamada OpenAI
  types.ts           # Interfaces TypeScript
```

---

## 3. Interfaces Principales

```typescript
// types.ts

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatConfig {
  apiKey: string;           // de .env o override del usuario
  model: 'gpt-4o-mini';   // único modelo soportado (CORS)
  context: string;           // contenido del .md subido
}

export interface FileUploadResult {
  fileName: string;
  content: string;          // texto plano del .md
  truncated: boolean;       // true si excede límite
}
```

---

## 4. Integración con OpenAI

### 4.1. Configuración de API Key

```typescript
// useChat.ts

// 1. Valor por defecto desde .env (Vite)
const DEFAULT_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

// 2. Override opcional del usuario (localStorage)
const userOverrideKey = localStorage.getItem('chat_user_api_key') || '';
const effectiveKey = userOverrideKey || DEFAULT_API_KEY;
```

### 4.2. Llamada a OpenAI API

```typescript
// useChat.ts

const sendMessage = async (userMessage: string) => {
  const apiKey = getEffectiveApiKey(); // .env + override check
  
  if (!apiKey) {
    throw new Error('No API key configured. Set VITE_OPENAI_API_KEY in .env or provide your own.');
  }

  // Contexto del .md inyectado en system prompt
  const systemPrompt = context 
    ? `Answer based ONLY on the following context:\n\n${context}\n\nIf the answer is not in the context, say so.`
    : 'You are a helpful assistant.';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages, // historial de chat
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3, // más preciso para Q&A basada en fuentes
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};
```

---

## 5. Manejo de Archivos (.md)

### 5.1. FileReader (sin dependencias)

```typescript
// FileUpload.tsx

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file || !file.name.endsWith('.md')) {
    alert('Por favor sube un archivo .md válido');
    return;
  }

  const reader = new FileReader();
  
  reader.onload = (e) => {
    const content = e.target?.result as string;
    
    // Truncar si excede ~400K caracteres (límite GPT-4o)
    const MAX_CONTEXT = 400000;
    const truncated = content.length > MAX_CONTEXT;
    const finalContext = truncated ? content.substring(0, MAX_CONTEXT) : content;

    setContext({
      fileName: file.name,
      content: finalContext,
      truncated,
    });
  };

  reader.readAsText(file);
};
```

---

## 6. UI: Burbuja Flotante

```typescript
// index.tsx (ChatBubble)

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <ChatWindow onClose={() => setIsOpen(false)} />
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
    </div>
  );
};
```

---

## 7. Renderizado de Markdown

```typescript
// MessageList.tsx

import Markdown from 'react-markdown';

const MessageList = ({ messages }: { messages: ChatMessage[] }) => {
  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {msg.role === 'assistant' ? (
              <Markdown>{msg.content}</Markdown>
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## 8. Persistencia (localStorage)

```typescript
// useChat.ts

const [messages, setMessages] = useState<ChatMessage[]>(() => {
  const saved = localStorage.getItem('chat_messages');
  return saved ? JSON.parse(saved) : [];
});

// Guardar cada vez que cambie
useEffect(() => {
  localStorage.setItem('chat_messages', JSON.stringify(messages));
}, [messages]);

// Guardar API key override
const saveUserApiKey = (key: string) => {
  localStorage.setItem('chat_user_api_key', key);
};
```

---

## 9. Seguridad y Advertencias

### 9.1. API Key en .env (Vite)

```typescript
// ⚠️ ADVERTENCIA IMPORTANTE
// Las variables VITE_* se inyectan en el bundle client-side
// Cualquiera puede ver la API key en DevTools → Sources → buscar VITE_OPENAI_API_KEY

const keySource = userOverrideKey 
  ? 'Tu API key personal' 
  : '⚠️ API key del sitio (visible en código client-side)';
```

### 9.2. Recomendación para Usuarios

Si el usuario quiere privacidad total:
1. Usar su propia API key (override en UI)
2. Su key se guarda en localStorage (también visible, pero es SUYA)
3. O usar un proxy serverless (fuera de alcance para este MVP)

---

## 10. Integración en App.tsx

```typescript
// App.tsx

import ChatBubble from './components/ChatBubble';

function App() {
  return (
    <div>
      {/* ... existing layout ... */}
      <Navbar />
      <main>{/* ... */}</main>
      <Footer />
      
      {/* ChatBubble SIEMPRE visible */}
      <ChatBubble />
    </div>
  );
}
```

---

## 11. Dependencias Nuevas

```bash
npm install react-markdown
```

**Peso total**: ~5KB (gzip)

(Opcional, no requerido):
- `remark-gfm` (GitHub Flavored Markdown) — +3KB
- `rehype-highlight` (syntax highlighting) — +5KB

---

## 12. Flujo de Usuario Resumido

1. **Usuario entra a la app** → ve burbuja (inferior-derecha)
2. **Hace clic** → se expande ventana de chat
3. **(Opcional) Configura su API key** en "Configuración"
4. **Sube archivo `.md`** con referencias
5. **Chatea** → IA responde basada en el `.md`
6. **(Si no hay .md)** → IA usa conocimiento general (con advertencia)

---

## 13. Testing

- No hay tests unitarios para la UI del chat (se testea manualmente)
- La lógica de `useChat.ts` se puede testear con mocks de `fetch`
- Asegurar que el build siga pasando (67/67 tests existentes)

---

## 14. Riesgos Técnicos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| API key visible en client | ALTO (cualquiera puede usarla) | Advertir usuario, rate limiting en OpenAI |
| Context window exceeded | MEDIO (archivos grandes) | Truncar + warning |
| CORS block (Anthropic) | ALTO (no funciona) | Solo usar OpenAI GPT-4o-mini |
| Costos de API | MEDIO (para el sitio) | Mostrar costo estimado, rate limit |
| localStorage vulnerability | BAJO (XSS) | Sanitize inputs, CSP headers |
