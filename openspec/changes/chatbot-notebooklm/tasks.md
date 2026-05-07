# Tasks: Chatbot Burbuja (NotebookLM-like)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~350-450 (6 new components + 1 hook + App.tsx wiring + types) |
| 400-line budget risk | Medium |
| Chained PRs recommended | No (single cohesive feature, can land as one PR) |
| Suggested split | Single PR to main |
| Delivery strategy | single-pr |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Types + useChat hook + react-markdown dependency | PR 1 | Core logic, no UI yet |
| 2 | All UI components + App.tsx wiring + polish | PR 2 | Depends on PR 1 |

---

## Phase 1: Foundation — Types, Dependency, Security Decision

- [ ] 1.1 `npm install react-markdown` — markdown rendering for bot responses
- [ ] 1.2 Create `src/components/ChatBubble/types.ts` — define `ChatMessage`, `ChatConfig`, `FileUploadResult` interfaces per design.md
- [ ] 1.3 **SECURITY**: Do NOT use `import.meta.env.VITE_OPENAI_API_KEY` — user MUST provide their own key (no `.env` default). Store in `sessionStorage` (cleared on tab close), with optional `localStorage` save for convenience.

## Phase 2: Core Hook — useChat.ts

- [ ] 2.1 Create `src/components/ChatBubble/useChat.ts` — `useChat()` custom hook with `messages`, `context`, `isLoading`, `error` state
- [ ] 2.2 Load messages from `localStorage` key `chat_messages` on init, sync on every change
- [ ] 2.3 Implement `getEffectiveApiKey()` — read from `sessionStorage` first, fallback to `localStorage`, return empty string if none
- [ ] 2.4 Implement `sendMessage(userMessage: string)` — POST to `https://api.openai.com/v1/chat/completions` with `gpt-4o-mini` model, `temperature: 0.3`
- [ ] 2.5 Build system prompt: when `.md` context exists → `"Answer based ONLY on the following context: ${context}"`, otherwise → `"You are a helpful assistant."`
- [ ] 2.6 Include full chat history (`...messages`) in the API call messages array
- [ ] 2.7 Handle errors: invalid key (401), rate limits (429), network failures — set `error` state with user-friendly message
- [ ] 2.8 Implement `setContext(content: string, fileName: string, truncated: boolean)` and `clearContext()` methods
- [ ] 2.9 Implement `saveUserApiKey(key: string)` and `clearUserApiKey()` methods

## Phase 3: UI Components — File Upload & API Key

- [ ] 3.1 Create `src/components/ChatBubble/FileUpload.tsx` — file input accepting `.md` only, use `FileReader.readAsText()`, show filename after upload, truncate content to 400K chars with warning if exceeded
- [ ] 3.2 Create `src/components/ChatBubble/ApiKeyInput.tsx` — password input for OpenAI key, save to `sessionStorage` on change, optional checkbox to persist in `localStorage`, clear button, indicator of key source ("Tu API key personal")

## Phase 4: UI Components — Chat Interface

- [ ] 4.1 Create `src/components/ChatBubble/MessageList.tsx` — render messages: user right-aligned (blue bg), assistant left-aligned (gray bg), use `react-markdown` for assistant content
- [ ] 4.2 Create `src/components/ChatBubble/ChatWindow.tsx` — expanded chat panel with: close button, FileUpload, ApiKeyInput (in settings/config section), MessageList, text input + send button, typing indicator ("Escribiendo...")
- [ ] 4.3 Auto-scroll to bottom on new message in ChatWindow
- [ ] 4.4 Responsive: ChatWindow max-width ~400px on desktop, full-width on mobile with bottom-safe padding

## Phase 5: UI Component — Floating Bubble

- [ ] 5.1 Create `src/components/ChatBubble/index.tsx` — `ChatBubble` component with `useState<boolean>` for open/close, fixed position `bottom-6 right-6 z-50`, circular button (w-14 h-14) with chat icon, swap to ChatWindow when open

## Phase 6: Integration & Polish

- [ ] 6.1 Wire `<ChatBubble />` into `src/App.tsx` — render after Footer, always present on all pages
- [ ] 6.2 Connect `useChat` hook to ChatWindow: messages display, send action, file upload, API key config
- [ ] 6.3 Add warning banner in UI: "Tu clave de OpenAI se guarda solo en tu navegador"
- [ ] 6.4 Error display: show `error` state from `useChat` inline in ChatWindow (not just console)
- [ ] 6.5 Loading state: disable send button + show "Escribiendo..." while `isLoading` is true
- [ ] 6.6 Dark mode: ensure all components respect existing dark mode classes

## Phase 7: Verification

- [ ] 7.1 `npm run test:run` — verify existing 67/67 tests still pass
- [ ] 7.2 `npm run build` — verify Vite build succeeds with no errors
- [ ] 7.3 Manual test: provide API key → upload `.md` → ask question → verify response is based on uploaded context
- [ ] 7.4 Manual test: no API key → verify warning shown and chat disabled
- [ ] 7.5 Manual test: large `.md` file → verify truncation warning appears

---

## Security Note

**API key is NEVER bundled**. `import.meta.env.VITE_OPENAI_API_KEY` is NOT used. User always provides their own key. Key lives only in `sessionStorage` (transient) or `localStorage` (persistent, user's choice).

**Future**: If deployment migrates to Vercel/Netlify, create `/api/chat` serverless function to fully hide the key server-side.
