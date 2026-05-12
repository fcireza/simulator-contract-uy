# Manual de Usuario - Simulador de Ingresos Contractors IT Uruguay

## ¿Qué es este simulador?

Es una herramienta web gratuita que te permite calcular cuánto dinero vas a recibir **en tu bolsillo** como contractor IT en Uruguay, después de pagar todos los impuestos.

---

## 🌐 Pestañas de la App

La aplicación tiene **3 pestañas** en la barra de navegación:

| Pestaña | Descripción |
|---------|-------------|
| **Simulador** | Calculá tu ingreso neto (bruto → neto) o el ingreso requerido (neto → bruto) |
| **Guía Contractor** | Información detallada sobre impuestos, regímenes y deducciones |
| **About** | Acerca del proyecto, misión y disclaimer |

---

## Primeros Pasos

### 1. Acceder al Simulador
- Abrí el simulador en tu navegador
- Verás la pestaña **Simulador** activa por defecto
- El **modo oscuro** está activado por defecto

### 2. Elegir el tipo de simulación
Tenés dos modos:

| Modo | Qué hace | Cuándo usarlo |
|------|----------|---------------|
| **Simulación Normal** | Ingreso Bruto → Neto | "Cobro US$ 3000, ¿cuánto me queda?" |
| **Simulación Inversa** | Ingreso Neto Deseado → Bruto Necesario | "Quiero llevarme US$ 2000, ¿cuánto tengo que facturar?" |

Hacé click en el botón correspondiente para cambiar de modo.

---

## Configuración Básica

### Tipo de Cambio (UYU/USD)
- Ingresá el valor actual del dólar (ej. 39.5)
- Este valor se usa para convertir tus ingresos de USD a UYU antes de calcular impuestos

### Tipo de Cliente
- **Exterior**: Facturás al extranjero → **IVA 0%** ✅
- **Local**: Facturás en Uruguay → **IVA 22%** ⚠️

> 💡 **Tip**: La mayoría de los contractors IT facturan al exterior para evitar el IVA.

---

## Elección de Régimen Impositivo

Esta es la decisión MÁS IMPORTANTE del simulador.

### Unipersonal (Industria y Comercio)
- **Ideal para**: Contractors que recién empiezan o facturan menos de ~US$ 4000/mes
- **Impuestos 2026** (valores BPS actuales):
  - BPS: 15% fijo sobre el 70% del ingreso bruto (base imponible)
  - FONASA: tasa variable (8% o 9.5% base según ingresos, +2% cónyuge, +1.5% por hijo) sobre el 70% del ingreso bruto
  - IRPF: Tramos progresivos. Afecta a ingresos > 7 BPC mensuales ($48.048 UYU en 2026). Permite deducir: 30% ficto gastos, aportes BPS/Caja, FONASA, FRL, y $20 BPC por hijo menor ($137.280 UYU 2026)
  - Los servicios (contador, escribana, facturación) se restan **después** de impuestos

### SAS (Sociedad por Acciones Simplificada)
- **Ideal para**: Ingresos altos (>US$ 4000/mes) o necesidad de imagen empresarial
- Requiere constitución con escribana (un único pago ~$8.000 UYU)
- Dos modalidades:
  - **SAS con Caja Profesional**: Aportás a la caja de tu profesión (22.5% + IRAE 25%)
  - **SAS sin Caja**: Aportás al BPS común (7.5% BPS + FONASA variable + IRAE 25%)
- Los servicios (contador, escribana, facturación) son **gastos deducibles** que reducen el IRAE

> 💡 **Tip**: Si tenés gastos deducibles altos (contador, software, hardware), SAS suele convenir más.

---

## Servicios (Gastos Deducibles)

Podés agregar servicios opcionales que afectan el cálculo:

| Servicio | Costo Default | Notas |
|----------|---------------|-------|
| **Contador** | $5.000 UYU/mes | Obligatorio para SAS, recomendado para todos |
| **Escribana** | $8.000 UYU | Solo para constituir SAS (pago único) |
| **Facturación** | $3.000 UYU/mes | Plataforma de facturación |

> ✏️ **Editá los costos**: Podés cambiar el valor haciendo click en el servicio y modificando el número. También podés elegir si el costo está en **USD** o **UYU**.

---

## Cómo Usar el Simulador

### Simulación Normal (Bruto → Neto)

1. **Ingresá tu ingreso mensual** en USD (ej. 3000)
2. **Tipo de cambio** (ej. 39.5)
3. **Tipo de cliente** (Exterior recomendado)
4. **Elegí tu régimen**: Unipersonal o SAS
   - Si elegís SAS, aparecerá un switch para indicar si aportás a Caja Profesional
5. **Marcá los servicios** que necesitás (Contador, Escribana, Facturación)
6. Hacé click en **"Calcular"**
7. **Resultado**: Vas a ver tu ingreso neto en USD y UYU, con el desglose de impuestos

#### Botón "Comparar con otros regímenes"
Después de calcular, aparecerá este botón. Al hacer click, se calcularán los otros 2 regímenes con el mismo ingreso bruto, y se mostrará cuál te conviene más.

### Simulación Inversa (Neto Deseado → Bruto)

1. **Ingresá el ingreso neto que querés llevarte** en USD (ej. 2000)
2. El **tipo de cambio y régimen** se toman de la pestaña de Simulación Normal
3. Marcá los **servicios** necesarios
4. Hacé click en **"Calcular Ingreso Requerido"**
5. **Resultado**: Te dirá cuánto tenés que facturar (bruto) para llevarte ese neto

---

## Valores Oficiales 2026 (BPS - DGI)

### Bases y Valores Vigentes (Abril/Mayo 2026)
- **BPC** (Base de Prestaciones y Contribuciones): **$6.864,00**
- **BFC** (Base Ficta de Contribución): **$1.847,96**
- **Salario mínimo nacional**: **$24.572,00**
- **Cuota mutual**: **$1.820,00** (Abril/Mayo)
- **UR** (Unidad Reajustable): **$1.914,42** (Abril)

### Tasas FONASA 2026
- **Base imponible ≤ 2,5 BPC** ($17.160): 8% base + 2% cónyuge (hijos 0% en este tramo)
- **Base imponible > 2,5 BPC**: 9,5% base + 2% cónyuge + 1,5% por hijo
- La tasa aplica sobre el 70% del ingreso bruto (tope 15 BPCs)
- Válido para **Unipersonal** y **SAS sin Caja**

### IRPF 2026 - Deducciones
- **Hijo menor**: $20 BPC anuales ($137.280 UYU)
- **Hijo con discapacidad**: $40 BPC anuales ($274.560 UYU)
- **Fondo Solidaridad**: 0,1% (adicional)
- **Tope deducción hipoteca**: $36 BPC anuales ($247.104 UYU)
- **Tope ingresos IRPF**: > 7 BPC mensuales ($48.048 UYU)

### Fondo de Solidaridad (Egresados)
- **Udelar/UTEC/UTU**: Egresados con ingresos > 8 BPC mensuales ($54.912) desde el 5º año
- **Aportes**: Graduales desde el 5º año (1/2 BPC) hasta 2 BPC completas
- **Carreras > 4 años**: Desde 5 BPC ($34.320) anuales

---

## Comparador de Regímenes

Después de hacer una simulación normal, hacé click en **"Comparar con otros regímenes"**.

Vas a ver 3 tarjetas, una por cada régimen:
- **Unipersonal**
- **SAS con Caja**
- **SAS sin Caja**

### Qué muestra cada tarjeta:
- Régimen impositivo y sus impuestos
- Tu **ingreso neto** en grande (en USD y UYU)
- Desglose de impuestos y gastos deducibles
- La **MEJOR OPCIÓN** tiene un borde verde y dice "MEJOR OPCIÓN" ✅

> 🎯 **Objetivo**: Elegir el régimen que te deje más dinero en el bolsillo.

---

## Ejemplo Práctico

### Caso: Contractor IT cobrando US$ 3000/mes

1. **Simulación Normal**:
   - Ingreso: US$ 3000
   - Tipo de cambio: 39.5 (→ $118.500 UYU)
   - Cliente: Exterior (0% IVA)
   - Régimen: Unipersonal
   - Servicios: Contador ($5000)
   - **Resultado**: ~US$ 1900 netos

2. **Comparar regímenes**:
   - Unipersonal: ~US$ 1900 netos
   - SAS con Caja: ~US$ 1700 netos (por los impuestos más altos)
   - SAS sin Caja: ~US$ 1850 netos
   - ✅ **Mejor opción: Unipersonal**

3. **Simulación Inversa** (para llevarme US$ 2500 netos):
   - Necesitás facturar ~US$ 3900

---

## Pestaña "Guía"

La pestaña **Guía Contractor** contiene información detallada organizada en 9 secciones:

1. **¿Qué es un Contractor?** - Definición y contexto
2. **Régimen Unipersonal** - Aportes y características
3. **IRPF** - Impuesto a la Renta
4. **IVA** - Impuesto al Valor Agregado
5. **SAS** - Sociedad por Acciones Simplificada
6. **BPS 2026** - Valores del Banco de Previsión Social
7. **FONASA 2026** - Tasas de salud
8. **Fondo de Solidaridad** - Aportes para egresados
9. **Guía de Decisión** - Cómo elegir el régimen

Cada sección es **expandible** clickeando en el título.

---

## Pestaña "Acerca"

La pestaña **About** incluye:
- Mission statement del proyecto
- Features destacadas
- Disclaimer legal sobre la precisión de los cálculos
- Créditos y links a redes sociales

---

## Navegación

Podés navegar entre las secciones desde:
- **La barra de navegación** arriba
- **El footer** con enlaces rápidos (Simulador, Guía, About)

---

## Limitaciones del MVP

El simulador es una herramienta de **estimación**. No considera:
- Deducciones complejas (alquileres, servicios, hardware, Fondo Solidaridad)
- Cambios en la legislación después de **Mayo 2026**
- Múltiples fuentes de ingreso simultáneas (relación de dependencia + independiente)
- IRPF anual completo (usamos simplificación bimestral)
- Anticipos bimestrales exactos (usamos promedio anual)

> 🎓 **Para asesoramiento fiscal profesional**, consultá con un contador especializado.
> 📚 **Fuentes**: [BPS Valores 2026](https://www.bps.gub.uy/bps/valores.jsp?contentid=5478) | [DGI IRPF](https://www.gub.uy/direccion-general-impositiva/comunicacion/publicaciones/irpf-para-trabajadores-independientes) | [BPS Tasas FONASA](https://www.bps.gub.uy/10314/tasas-fonasa.html)

---

## Preguntas Frecuentes (FAQ)

### ¿Por qué SAS me da menos neto que Unipersonal?
Porque el IRAE (25%) suele ser más alto que el IRPF en tramos bajos/medios. SAS conviene cuando tenés **gastos deducibles altos** o necesitás **imagen empresarial**.

### ¿Cuándo me conviene SAS sin Caja?
Si sos **no universitario** (o no querés aportar a Caja), y tus ingresos superan los ~US$ 4000/mes. El BPS común (~12.5%) es menor que Caja (~22.5%).

### ¿El servicio de Escribana es obligatorio?
**Solo para constituir SAS**. Una vez constituida, no necesitás pagarla mensualmente. El simulador la incluye como gasto único estimado.

### ¿Puedo cambiar el costo de los servicios?
¡Sí! Hacé click en el checkbox del servicio y vas a poder editar el monto. También podés cambiar la moneda (USD/UYU) con el selector.

### ¿Por qué el comparador usa el mismo ingreso bruto?
Para que la comparación sea **justa**. Estamos comparando "con el mismo dinero que entra, ¿cuánto me queda en cada régimen?".

---

## Contacto y Contribuciones

Este es un proyecto open-source. Si encontrás errores o querés sugerir mejoras, podés:
- Reportar issues en el repositorio
- Enviar pull requests con mejoras
- Contactar al desarrollador

---

*💻 Simulador Contractors IT Uruguay - Versión Beta - Mayo 2026 - By for fcireza*