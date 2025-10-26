#!/usr/bin/env python3
"""
Script para agregar el módulo schema.js a todas las páginas HTML
Inserta el script antes de los demás scripts, después de accesibilidad.js
"""

import os
import re
from pathlib import Path

def agregar_schema_script(archivo_html):
    """Agrega el script schema.js si no existe"""
    
    with open(archivo_html, 'r', encoding='utf-8') as f:
        contenido = f.read()
    
    # Verificar si ya tiene el script
    if 'js/schema.js' in contenido:
        print(f"✓ {archivo_html.name} - Ya tiene schema.js")
        return False
    
    # Buscar la línea de accesibilidad.js o el primer script
    patron = r'(\s*<script src="js/accesibilidad\.js"></script>)'
    
    if re.search(patron, contenido):
        # Insertar después de accesibilidad.js
        nuevo_contenido = re.sub(
            patron,
            r'\1\n  <script src="js/schema.js"></script>',
            contenido,
            count=1
        )
    else:
        # Si no encuentra accesibilidad.js, buscar cualquier script antes de </body>
        patron_script = r'(\s*<script[^>]*>.*?</script>)(\s*</body>)'
        if re.search(patron_script, contenido, re.DOTALL):
            # Insertar antes del primer script
            nuevo_contenido = re.sub(
                r'(\s*)(<script)',
                r'\1<script src="js/schema.js"></script>\n\1\2',
                contenido,
                count=1
            )
        else:
            print(f"✗ {archivo_html.name} - No se encontró dónde insertar el script")
            return False
    
    # Guardar cambios
    with open(archivo_html, 'w', encoding='utf-8') as f:
        f.write(nuevo_contenido)
    
    print(f"✓ {archivo_html.name} - Script agregado")
    return True

def main():
    """Procesa todos los archivos HTML"""
    
    # Directorio raíz del proyecto
    directorio = Path(__file__).parent
    
    # Archivos HTML en la raíz (excluir componentes.html que es demo)
    archivos_html = [
        'index.html',
        'buscar.html',
        'proveedor.html',
        'jardineria.html',
        'plomeria.html',
        'electricidad.html',
        'limpieza.html',
        'construccion.html',
        'abogacia.html',
        'contaduria.html',
        'veterinaria.html',
        'mecanica.html',
        'ferreteria.html',
        'corralon.html',
        'todos_los_servicios.html',
        'login.html',
        'registro.html',
        'perfil.html',
        'politicas.html'
    ]
    
    archivos_modificados = 0
    archivos_totales = 0
    
    print("\n🔄 Agregando schema.js a archivos HTML...\n")
    
    for nombre_archivo in archivos_html:
        archivo = directorio / nombre_archivo
        if archivo.exists():
            archivos_totales += 1
            if agregar_schema_script(archivo):
                archivos_modificados += 1
        else:
            print(f"⚠ {nombre_archivo} - Archivo no encontrado")
    
    print(f"\n✅ Proceso completado:")
    print(f"   - Archivos procesados: {archivos_totales}")
    print(f"   - Archivos modificados: {archivos_modificados}")
    print(f"   - Archivos sin cambios: {archivos_totales - archivos_modificados}\n")

if __name__ == '__main__':
    main()
