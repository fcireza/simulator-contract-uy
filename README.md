# Simulador de Ingresos para Contractors IT en Uruguay

Una aplicación web gratuita que permite calcular el ingreso neto de contractors IT en Uruguay después de pagar todos los impuestos, comparando los diferentes regímenes impositivos disponibles.

## ✨ Características

- **Cotización Automática del Dólar**:
  - Obtiene la cotización actual USD/UYU automáticamente al cargar (vía exchangerate-api.com)
  - Valor por defecto: US$ 1 = $39.5 UYU
  - Editable manualmente si el usuario lo desea
  - Manejo de errores: si la API falla, usa el valor por defecto sin interrumpir la experiencia

- **Dual Simulation Mode**: 
  - Simulación Normal (Bruto → Neto): "Cobro US$ 3000, ¿cuánto me queda?"
  - Simulación Inversa (Neto → Bruto): "Quiero llevarme US$ 2000, ¿cuánto tengo que facturar?"
   
- **3 Regímenes Impositivos**:
  - Unipersonal (Industria y Comercio) - IRPF + BPS/FONASA
  - SAS con Caja Profesional - IRAE 25% + Caja ~22.5%
  - SAS sin Caja Profesional (BPS Común) - IRAE 25% + BPS ~12.5%

- **Servicios Editables**:
  - Contador ($5.000 UYU por defecto)
  - Escribana ($8.000 UYU por defecto) - solo para SAS
  - Facturación ($3.000 UYU por defecto)
  - Moneda editable (USD/UYU) para cada servicio

- **Comparación Visual**:
  - Compara los 3 regímenes simultáneamente
  - Resalta automáticamente la mejor opción
  - Desglose detallado de impuestos y gastos deducibles

- **Guía Completa**:
  - Valores oficiales 2026 de BPS, DGI y Fondo Solidaridad
  - Explicación de cada régimen y deducciones admitidas
  - 9 secciones informativas con iconos
  - Diseño expandible con animaciones

- **Página Acerca**:
  - Presentación atractiva del proyecto
  - Mission statement
  - Disclaimer legal
  - Créditos

- **Experiencia de Usuario**:
  - Diseño responsivo con Tailwind CSS v4
  - **Modo oscuro por defecto**
  - Footer fijo con navegación rápida
  - Comparación en modal enfocado

## 🚀 Cómo Ejecutar Localmente

### Prerrequisitos
- Node.js 18+ o superior
- npm 9+ o superior

### Pasos
```bash
# Clonar el repositorio
git clone https://github.com/fcireza/simulador-contract-uy.git
cd simulador-contract-uy

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Para Construir para Producción
```bash
npm run build
# Los archivos generados estarán en la carpeta /dist
```

## 📁 Estructura del Proyecto

```
simulador-contract-uy/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Navbar.tsx      # Barra de navegación
│   │   │   └── Footer.tsx     # Footer con navegación
│   │   ├── Guide.tsx          # Guía de información
│   │   ├── About.tsx           # Página About
│   │   ├── Inputs.tsx          # Formulario de simulación
│   │   ├── ReverseSim.tsx      # Simulación inversa
│   │   ├── Results.tsx         # Resultados
│   │   ├── RegimeComparison.tsx # Comparación de regímenes
│   │   └── Modal.tsx           # Modal de comparación
│   ├── utils/
│   │   └── taxCalculator.ts     # Lógica de impuestos (Strategy Pattern)
│   ├── App.tsx                 # Componente principal
│   └── main.tsx                # Punto de entrada
├── doc/
│   ├── 01-objetivos.md         # Objetivos del proyecto
│   └── 02-manual-usuario.md    # Manual de usuario
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🧠 Cómo Funciona

### Patrón Strategy en `taxCalculator.ts`
El cálculo de impuestos implementa el Strategy Pattern para manejar los 3 regímenes impositivos:

- **Unipersonal**: IRPF + BPS/FONASA (base imponible: 70% del bruto)
- **SAS con Caja**: IRAE 25% + Caja 22.5% (sobre base imponible)
- **SAS sin Caja**: IRAE 25% + BPS 12.5% (sobre base imponible)

### Navegación
El footer contiene enlaces rápidos que navegan a las 3 pestañas principales:
- **Simulador**: Formulario de cálculo
- **Guía Contractor**: Información detallada
- **About**: Acerca del proyecto

## 📚 Recursos Oficiales Utilizados

Los valores y fórmulas utilizados en este simulador provienen de fuentes oficiales uruguayas actualizadas a 2026:

- **Banco de Previsión Social (BPS)**: Valores BPC, BFC, tasas FONASA, regímenes de aportes
- **Dirección General Impositiva (DGI)**: Ley del IRPF, deducciones admitidas, cálculo de anticipos
- **Fondo de Solidaridad**: Reglas de aporte para egresados de instituciones públicas
- **Decreto 148/007**: Reglamento de la Ley del IRPF

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- A los contadores y asesores fiscales que brinex orientación en la comunidad
- A las instituciones públicas uruguayas por publicar sus datos y regulaciones de forma accesible

---

*💻 Construido con ❤️ por [fcireza](https://fcireza.vercel.app) • Versión Beta • Actualizado Mayo 2026*