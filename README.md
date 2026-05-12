# Simulador de Ingresos para Contractors IT en Uruguay

Una aplicación web gratuita que permite calcular el ingreso neto de contractors IT en Uruguay después de pagar todos los impuestos, comparando los diferentes regímenes impositivos disponibles.

## ✨ Características

- **Cotización Automática del Dólar**
- **Dual Simulation Mode**
- **3 Regímenes Impositivos**
- **Servicios Editables**
- **Comparación Visual**
- **Guía Completa 2026**
- **Página Acerca**
- **Experiencia de Usuario**:
  - **Modo oscuro por defecto**

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