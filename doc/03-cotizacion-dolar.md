# Cotización del Dólar (USD/UYU)

## Resumen
La aplicación obtiene automáticamente la cotización actual del dólar estadounidense (USD) en pesos uruguayos (UYU) al cargar, utilizando una API pública gratuita.

## Implementación

### Hook: `useExchangeRate`
**Archivo**: `src/hooks/useExchangeRate.ts`

Este custom hook:
- Consulta la API `https://api.exchangerate-api.com/v4/latest/USD` al montar el componente
- Extrae la tasa `UYU` de la respuesta
- Redondea a 2 decimales
- Maneja errores gracefully (usa valor por defecto 39.5 si falla)
- Expone: `rate`, `loading`, `error`

```typescript
const { rate, loading, error } = useExchangeRate(39.5);
// rate: número (cotización actual)
// loading: boolean (está consultando)
// error: string | null (mensaje si falla)
```

### Integración en la App

**Archivo**: `src/App.tsx`
```typescript
const { rate: fetchedRate, loading: rateLoading, error: rateError } = useExchangeRate(39.5);
const [exchangeRateManual, setExchangeRateManual] = useState<number | null>(null);
const exchangeRate = exchangeRateManual ?? fetchedRate;
```

La app usa `exchangeRateManual` si el usuario editó el campo manualmente, sino usa `fetchedRate` (la cotización automatica).

### Componentes Actualizados

1. **`Inputs.tsx`**: Recibe `exchangeRate`, `exchangeRateLoading`, `exchangeRateError` como props. Muestra "Cargando..." y el error si ocurre.

2. **`ReverseSim.tsx`**: Igual que Inputs, recibe las mismas props para mostrar la cotización actual.

3. **`Results.tsx`**: Muestra la cotización usada en el resultado (`exchangeRate` prop).

## API Utilizada

**URL**: `https://api.exchangerate-api.com/v4/latest/USD`

**Respuesta esperada**:
```json
{
  "base": "USD",
  "rates": {
    "UYU": 39.75,
    ...
  }
}
```

**Ventajas**:
- ✅ Gratuita (sin API key)
- ✅ No requiere registro
- ✅ Soporta CORS
- ✅ Actualizada diariamente

**Alternativa**: `https://open.er-api.dev/api/latest.json?base=USD` (también gratuita)

## Comportamiento ante Errores

Si la API falla (sin internet, API caída, etc.):
1. Se muestra un warning en consola: `"Failed to fetch exchange rate, using default:"`
2. Se setea `error` state (se muestra debajo del input)
3. Se usa el valor por defecto (39.5)
4. La app sigue funcionando normalmente

## Valor por Defecto

El valor por defecto es **39.5 UYU/USD**, que representa aproximadamente la cotización histórica. El usuario puede editar este valor manualmente en el formulario si lo desea.

## Testing

El hook no se testea unitariamente (requiere mocking de fetch). En su lugar, se testean los componentes que lo consumen pasando props simuladas.
