# Simulador de Ingresos para Contractors IT en Uruguay

Aplicación web gratuita para calcular el ingreso neto de contractors IT en Uruguay después de impuestos, con simulación directa e inversa y comparación entre regímenes.

## ✨ Características

- **Cotización automática del dólar** — obtiene el tipo de cambio desde una API externa, con edición manual opcional
- **Toggle USD / UYU** — ingresá en la moneda que quieras, el simulador convierte automáticamente
- **Simulación directa** — ingresá tu ingreso bruto y obtené el detalle de todos los impuestos
- **Simulación inversa** — decí cuánto querés ganar neto y calculá el bruto necesario
- **3 regímenes** — Unipersonal, SAS con Caja Profesional, SAS sin Caja Profesional
- **Gastos deducibles editables** — contador, escribana, facturación
- **Comparación visual** — compará regímenes lado a lado en una tabla
- **Guía completa 2026** — resumen de impuestos, tasas y deducciones
- **Persistencia local** — los datos se guardan automáticamente, no se pierden al recargar
- **Modo oscuro** por defecto, con detección automática

## 🧱 Stack

- **React 19** + **TypeScript**
- **Vite** — dev server y build
- **Tailwind CSS v4** — estilos
- **Vitest** — 177 tests

## 🚀 Cómo ejecutar localmente

### Prerrequisitos

- Node.js 18+
- npm 9+

### Pasos

```bash
git clone git@github.com:fcireza/simulator-contract-uy.git
cd simulator-contract-uy
npm install
npm run dev
# → http://localhost:5173
```

### Build producción

```bash
npm run build     # → /dist
npm run preview   # previsualizar build
```

### Tests

```bash
npm test          # single run
npm run test:ui   # UI interactiva
```

## 📚 Fuentes oficiales

Valores y fórmulas actualizados a 2026 según:

- **Banco de Previsión Social (BPS)** — BPC, BFC, tasas FONASA
- **Dirección General Impositiva (DGI)** — IRPF, deducciones, anticipos
- **Fondo de Solidaridad** — aportes de egresados universitarios
- **Decreto 148/007** — reglamento del IRPF

## 🤝 Contribuir

1. Fork del repo
2. `git checkout -b feature/mi-feature`
3. Commit con [conventional commits](https://www.conventionalcommits.org/)
4. Push y abrí un Pull Request

## 📄 Licencia

MIT — ver [LICENSE](LICENSE).

---

*💻 Construido con ❤️ por [fcireza](https://fcireza.vercel.app) • Versión Beta • Actualizado Junio 2026*