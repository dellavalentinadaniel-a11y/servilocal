# Stylelint en la plataforma

## Instalación

1. Asegurate de tener Node 18 o superior instalado.
2. Instalá las dependencias de desarrollo:
   ```bash
   npm install
   ```

> Nota: si la red está restringida, corré el comando cuando tengas acceso a internet. Las dependencias quedan declaradas en `package.json`.

## Comandos disponibles

- `npm run lint:css`: analiza todos los archivos dentro de `css/` y muestra los errores.
- `npm run lint:css:fix`: intenta corregir automáticamente los problemas compatibles (formatos, espacios, etc.).

## Automatización con Husky

Ya dejamos configurado un hook de Husky en `.husky/pre-commit` que corre `npm run lint:css`.

1. Inicializá el repositorio (`git init`) si aún no lo hiciste.
2. Instalá dependencias (`npm install`). El script `prepare` ejecutará `husky install` y dejará listo el hook.

Desde ese momento, cada commit ejecutará el linter antes de finalizar. Si necesitás saltearlo puntualmente, podés usar `HUSKY=0 git commit ...`.

## Buenas prácticas cubiertas

- Uso de clases en minúsculas con convención BEM (`c-bloque__elemento--modificador`).
- Notación moderna para funciones de color (`color-mix`, `rgb`, etc.).
- Reglas del preset `stylelint-config-standard` más los ajustes necesarios para el proyecto.
