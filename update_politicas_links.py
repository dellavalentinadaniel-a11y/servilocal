#!/usr/bin/env python3
"""
Script para actualizar enlaces de políticas de privacidad para que abran en nueva pestaña
"""

import re
from pathlib import Path

def update_politicas_link(filepath):
    """Actualiza el enlace de políticas para que abra en nueva pestaña"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Patrón para encontrar enlaces a politicas.html que no tengan target="_blank"
        pattern = r'<a\s+([^>]*?)href="politicas\.html"([^>]*?)>'
        
        def replace_link(match):
            before = match.group(1)
            after = match.group(2)
            
            # Si ya tiene target="_blank", no hacer nada
            if 'target="_blank"' in before or 'target="_blank"' in after:
                return match.group(0)
            
            # Agregar target y rel
            return f'<a {before}href="politicas.html" target="_blank" rel="noopener noreferrer"{after}>'
        
        new_content = re.sub(pattern, replace_link, content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✓ {filepath.name} - Enlaces actualizados")
            return True
        else:
            print(f"○ {filepath.name} - Sin cambios necesarios")
            return False
            
    except Exception as e:
        print(f"✗ {filepath.name} - Error: {e}")
        return False

def main():
    """Procesar todos los archivos HTML"""
    base_dir = Path(__file__).parent
    html_files = list(base_dir.glob('*.html'))
    
    # Excluir politicas.html y componentes.html
    html_files = [f for f in html_files if f.name not in ['politicas.html', 'componentes.html']]
    
    print(f"\n🔗 Actualizando enlaces a políticas en {len(html_files)} archivos HTML...\n")
    
    updated_count = 0
    for html_file in sorted(html_files):
        if update_politicas_link(html_file):
            updated_count += 1
    
    print(f"\n✅ Proceso completado: {updated_count} archivos actualizados\n")

if __name__ == '__main__':
    main()
