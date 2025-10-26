#!/usr/bin/env python3
"""
Script para agregar los scripts necesarios a todas las páginas HTML
"""

import os
import re
from pathlib import Path

def add_scripts_to_file(filepath):
    """Agrega los scripts necesarios antes del cierre de </body>"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Verificar si ya tiene componentes.js
        if 'js/componentes.js' in content:
            print(f"✓ {filepath.name} - Ya tiene componentes.js")
            return False
        
        # Verificar si tiene accesibilidad.js para usarlo como referencia
        if 'js/accesibilidad.js' in content:
            # Agregar componentes.js después de accesibilidad.js
            new_content = content.replace(
                '<script src="js/accesibilidad.js"></script>',
                '<script src="js/accesibilidad.js"></script>\n  <script src="js/componentes.js"></script>'
            )
        else:
            # Agregar ambos scripts antes de </body>
            scripts = '''  <script src="js/accesibilidad.js"></script>
  <script src="js/componentes.js"></script>
</body>'''
            new_content = content.replace('</body>', scripts)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✓ {filepath.name} - Scripts agregados")
            return True
        else:
            print(f"✗ {filepath.name} - No se pudo agregar scripts")
            return False
            
    except Exception as e:
        print(f"✗ {filepath.name} - Error: {e}")
        return False

def main():
    """Procesar todos los archivos HTML"""
    base_dir = Path(__file__).parent
    html_files = list(base_dir.glob('*.html'))
    
    # Excluir componentes.html si existe
    html_files = [f for f in html_files if f.name != 'componentes.html']
    
    print(f"\n🔧 Agregando scripts a {len(html_files)} archivos HTML...\n")
    
    updated_count = 0
    for html_file in sorted(html_files):
        if add_scripts_to_file(html_file):
            updated_count += 1
    
    print(f"\n✅ Proceso completado: {updated_count} archivos actualizados\n")

if __name__ == '__main__':
    main()
